import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import SavedSearches from '../components/search/SavedSearches';
import type { Advertisement, ApiResponse, SavedSearch, SearchFilters } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's advertisements
  const { data: adsData, isLoading } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['user-ads', user?.id],
    queryFn: async () => {
      // Filter by current user - Strapi will automatically filter by authenticated user
      // but we can also add explicit filter if needed
      const response = await api.get('/advertisements?populate=*&sort=createdAt:desc');
      // Filter client-side to ensure we only show user's ads
      const filteredData = {
        ...response.data,
        data: response.data.data?.filter((ad: Advertisement) => {
          const adUserId = ad.user?.id || ad.owner?.id;
          return adUserId === user?.id;
        }) || [],
      };
      return filteredData;
    },
    enabled: isAuthenticated && !!user,
  });

  // Fetch saved searches
  const { data: savedSearchesData } = useQuery<ApiResponse<SavedSearch[]>>({
    queryKey: ['saved-searches', user?.id],
    queryFn: async () => {
      const response = await api.get('/saved-searches?populate=*&sort=createdAt:desc');
      return response.data;
    },
    enabled: isAuthenticated && !!user,
  });

  const deleteAdMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/advertisements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-ads'] });
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      await deleteAdMutation.mutateAsync(id);
    }
  };

  const handlePromote = (ad: Advertisement) => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+1234567890';
    const message = `I want to promote my ad: ${ad.title} (ID: ${ad.id})`;
    const url = generateWhatsAppUrl(whatsappNumber, message);
    window.open(url, '_blank');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const ads = adsData?.data || [];
  const totalAds = ads.length;
  const activeAds = ads.filter((ad) => ad.status === 'approved').length;
  const pendingAds = ads.filter((ad) => ad.status === 'pending').length;
  const totalViews = ads.reduce((sum, ad) => sum + (ad.viewCount || 0), 0);
  const savedSearches = savedSearchesData?.data || [];
  const savedSearchesCount = savedSearches.length;

  const handleSelectSavedSearch = (searchQuery: SearchFilters) => {
    const params = new URLSearchParams();
    if (searchQuery.q) params.append('q', String(searchQuery.q));
    if (searchQuery.category) params.append('category', String(searchQuery.category));
    if (searchQuery.city) params.append('city', String(searchQuery.city));
    if (searchQuery.minPrice) params.append('minPrice', String(searchQuery.minPrice));
    if (searchQuery.maxPrice) params.append('maxPrice', String(searchQuery.maxPrice));
    if (searchQuery.sort) params.append('sort', String(searchQuery.sort));
    navigate(`/search?${params.toString()}`);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
      expired: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || colors.draft
          }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          to="/post-ad"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Post New Ad
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Ads</p>
              <p className="text-3xl font-bold text-gray-900">{totalAds}</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Ads</p>
              <p className="text-3xl font-bold text-green-600">{activeAds}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingAds}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Views</p>
              <p className="text-3xl font-bold text-blue-600">{totalViews}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Saved Searches</p>
              <p className="text-3xl font-bold text-purple-600">{savedSearchesCount}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* My Ads Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">My Advertisements</h2>

        {ads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">You haven't posted any advertisements yet</p>
            <Link
              to="/post-ad"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Post Your First Ad
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Link
                        to={`/ad/${ad.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        {ad.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(ad.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      {ad.viewCount || 0}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/ad/${ad.id}`}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View"
                        >
                          👁️
                        </Link>
                        <Link
                          to={`/edit-ad/${ad.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handlePromote(ad)}
                          className="text-green-600 hover:text-green-800"
                          title="Promote"
                        >
                          📈
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Saved Searches Section */}
      <div className="mt-8">
        <SavedSearches onSelectSearch={handleSelectSavedSearch} />
      </div>
    </div>
  );
};

export default Dashboard;
