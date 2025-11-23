import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback, useEffect } from 'react';
import api from '../services/api';
import type { Advertisement, ApiResponse } from '../types';
import AdCard from '../components/ads/AdCard';
import SearchBar from '../components/search/SearchBar';
import SEOHead from '../components/seo/SEOHead';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const city = searchParams.get('city') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['search', search, category, city, minPrice, maxPrice, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': '24',
      });

      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (city) params.append('city', city);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      // Sorting
      if (sort === 'newest') {
        params.append('sort', 'createdAt:desc');
      } else if (sort === 'oldest') {
        params.append('sort', 'createdAt:asc');
      } else if (sort === 'price-low') {
        params.append('sort', 'price:asc');
      } else if (sort === 'price-high') {
        params.append('sort', 'price:desc');
      }

      params.append('populate', 'category,city,images');

      const response = await api.get(`/advertisements?${params.toString()}`);
      return response.data;
    },
  });

  const ads = data?.data || [];
  const pagination = data?.meta?.pagination;

  const { totalResults, currentPage, totalPages, startResult, endResult } = useMemo(() => {
    const total = pagination?.total || ads.length;
    const current = pagination?.page || page;
    const pages = pagination?.pageCount || 1;
    const pageSize = pagination?.pageSize || 24;
    const start = total > 0 ? ((current - 1) * pageSize) + 1 : 0;
    const end = Math.min(current * pageSize, total);
    return {
      totalResults: total,
      currentPage: current,
      totalPages: pages,
      startResult: start,
      endResult: end,
    };
  }, [pagination, ads.length, page]);

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  const handleSearch = useCallback((params: { q?: string; city?: string; category?: string }) => {
    const newParams = new URLSearchParams();
    if (params.q) newParams.append('q', params.q);
    if (params.city) newParams.append('city', params.city);
    if (params.category) newParams.append('category', params.category);
    newParams.delete('page'); // Reset to page 1 on new search
    navigate(`/search?${newParams.toString()}`);
  }, [navigate]);

  // Prefetch next page for better UX
  useEffect(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const params = new URLSearchParams({
        'pagination[page]': nextPage.toString(),
        'pagination[pageSize]': '24',
      });

      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (city) params.append('city', city);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      if (sort === 'newest') {
        params.append('sort', 'createdAt:desc');
      } else if (sort === 'oldest') {
        params.append('sort', 'createdAt:asc');
      } else if (sort === 'price-low') {
        params.append('sort', 'price:asc');
      } else if (sort === 'price-high') {
        params.append('sort', 'price:desc');
      }

      params.append('populate', 'category,city,images');

      // Prefetch next page
      queryClient.prefetchQuery({
        queryKey: ['search', search, category, city, minPrice, maxPrice, sort, nextPage],
        queryFn: async () => {
          const response = await api.get(`/advertisements?${params.toString()}`);
          return response.data;
        },
      });
    }
  }, [currentPage, totalPages, search, category, city, minPrice, maxPrice, sort, queryClient]);

  // Early return after all hooks
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`Search Results${search ? ` - ${search}` : ''}`}
        description={`Search for classified advertisements${search ? `: ${search}` : ''}. Filter by category, city, and price range.`}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Search Bar Section with Gray Background */}
        <div className="bg-gray-100 py-6">
          <div className="container mx-auto px-4">
            <SearchBar
              onSearch={handleSearch}
            />
            {!isLoading && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {startResult}-{endResult} of {totalResults} results
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading results...</p>
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg font-medium">No results found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria or browse all listings</p>
              <button
                onClick={() => navigate('/search')}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-8">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>

              {/* Enhanced Pagination */}
              {pagination && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {startResult}-{endResult} of {totalResults} results
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border transition ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-indigo-500'
                        }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {pageNumbers.map((pageNum, index) => {
                        if (pageNum === '...') {
                          return (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        const pageNumber = pageNum as number;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`min-w-[40px] px-3 py-2 rounded-lg border transition ${currentPage === pageNumber
                              ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-indigo-500'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg border transition ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-indigo-500'
                        }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;

