import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { Advertisement, ApiResponse, SearchFilters } from '../types';
import AdCard from '../components/ads/AdCard';
import FilterSidebar from '../components/search/FilterSidebar';
import SearchBar from '../components/search/SearchBar';
import SEOHead from '../components/seo/SEOHead';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  
  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const [filters, setFilters] = useState<{
    category?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>({
    category: category || undefined,
    city: city || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sort: sort || undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    if (page > 1) params.append('page', page.toString());

    navigate(`/search?${params.toString()}`, { replace: true });
  }, [filters, search, page, navigate]);

  const { data, isLoading } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['search', search, category, city, minPrice, maxPrice, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': '24',
      });

      if (search) params.append('filters[$or][0][title][$containsi]', search);
      if (category) params.append('filters[category][slug][$eq]', category);
      if (city) params.append('filters[city][slug][$eq]', city);
      if (minPrice) params.append('filters[price][$gte]', minPrice);
      if (maxPrice) params.append('filters[price][$lte]', maxPrice);

      // Sorting
      if (sort === 'newest') {
        params.append('sort[0]', 'createdAt:desc');
      } else if (sort === 'oldest') {
        params.append('sort[0]', 'createdAt:asc');
      } else if (sort === 'price-low') {
        params.append('sort[0]', 'price:asc');
      } else if (sort === 'price-high') {
        params.append('sort[0]', 'price:desc');
      }

      params.append('filters[status][$eq]', 'approved');
      params.append('populate', 'category,city,images');

      const response = await api.get(`/advertisements?${params.toString()}`);
      return response.data;
    },
  });

  const handleFilterChange = (newFilters: {
    category?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }) => {
    setFilters(newFilters);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('page'); // Reset to page 1 when filters change
      return newParams;
    });
  };

  const saveSearchMutation = useMutation({
    mutationFn: async (name: string) => {
      const searchQuery: SearchFilters = {};
      if (search) searchQuery.q = search;
      if (category) searchQuery.category = category;
      if (city) searchQuery.city = city;
      if (minPrice) searchQuery.minPrice = parseFloat(minPrice);
      if (maxPrice) searchQuery.maxPrice = parseFloat(maxPrice);
      if (sort) searchQuery.sort = sort;

      await api.post('/saved-searches', {
        data: {
          name,
          searchQuery,
          notificationsEnabled: true,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
      setShowSaveModal(false);
      setSaveSearchName('');
    },
  });

  const handleSaveSearch = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowSaveModal(true);
  };

  const handleSaveSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saveSearchName.trim()) {
      saveSearchMutation.mutate(saveSearchName.trim());
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const ads = data?.data || [];
  const pagination = data?.meta?.pagination;

  return (
    <>
      <SEOHead
        title={`Search Results${search ? ` - ${search}` : ''}`}
        description={`Search for classified advertisements${search ? `: ${search}` : ''}. Filter by category, city, and price range.`}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Search Results</h1>
        {isAuthenticated && (search || category || city || minPrice || maxPrice) && (
          <button
            onClick={handleSaveSearch}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <span>💾</span>
            Save Search
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={(params) => {
            const newParams = new URLSearchParams();
            if (params.q) newParams.append('q', params.q);
            if (params.city) newParams.append('city', params.city);
            if (params.category) newParams.append('category', params.category);
            navigate(`/search?${newParams.toString()}`);
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          {ads.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">No results found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {ads.length} result{ads.length !== 1 ? 's' : ''}
                {pagination && ` (Page ${pagination.page} of ${pagination.pageCount})`}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>

              {pagination && pagination.pageCount > 1 && (
                <div className="flex justify-center gap-2">
                  {page > 1 && (
                    <button
                      onClick={() => {
                        setSearchParams((prev) => {
                          const newParams = new URLSearchParams(prev);
                          newParams.set('page', (page - 1).toString());
                          return newParams;
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Previous
                    </button>
                  )}
                  <span className="px-4 py-2 flex items-center">
                    Page {pagination.page} of {pagination.pageCount}
                  </span>
                  {page < pagination.pageCount && (
                    <button
                      onClick={() => {
                        setSearchParams((prev) => {
                          const newParams = new URLSearchParams(prev);
                          newParams.set('page', (page + 1).toString());
                          return newParams;
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowSaveModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Save Search</h3>
                <form onSubmit={handleSaveSearchSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Name
                    </label>
                    <input
                      type="text"
                      value={saveSearchName}
                      onChange={(e) => setSaveSearchName(e.target.value)}
                      placeholder="e.g., Mumbai Call Girls"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSaveModal(false);
                        setSaveSearchName('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saveSearchMutation.isPending || !saveSearchName.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {saveSearchMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SearchResults;

