import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Advertisement, ApiResponse } from '../types';
import AdCard from '../components/ads/AdCard';
import FilterSidebar from '../components/search/FilterSidebar';
import SearchBar from '../components/search/SearchBar';
import SEOHead from '../components/seo/SEOHead';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

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
    </div>
    </>
  );
};

export default SearchResults;

