import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import PaymentStatus from '../components/subscription/PaymentStatus';
import PlanSelector from '../components/subscription/PlanSelector';
import PaymentRequestModal from '../components/subscription/PaymentRequestModal';
import type { Advertisement, ApiResponse, SubscriptionLimitCheck, PaymentRequest, SubscriptionPlan } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedAdForPayment, setSelectedAdForPayment] = useState<Advertisement | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  // Fetch subscription limit
  const { data: subscriptionLimit } = useQuery<{ data: SubscriptionLimitCheck }>({
    queryKey: ['subscription-limit', user?.id],
    queryFn: async () => {
      const response = await api.get('/user-subscriptions/check-limit');
      return response.data;
    },
    enabled: isAuthenticated && !!user,
  });

  // Fetch payment requests for draft ads
  const { data: paymentRequestsData } = useQuery<ApiResponse<PaymentRequest[]>>({
    queryKey: ['payment-requests', user?.id],
    queryFn: async () => {
      const response = await api.get('/payment-requests?populate=*&sort=createdAt:desc');
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

  const ads = Array.isArray(adsData?.data) ? adsData.data : [];
  const totalAds = ads.length;
  const activeAds = ads.filter((ad) => ad.status === 'approved').length;
  const pendingAds = ads.filter((ad) => ad.status === 'pending' || ad.status === 'draft').length;
  const totalViews = ads.reduce((sum, ad) => sum + (ad.viewCount || 0), 0);
  const paymentRequests = Array.isArray(paymentRequestsData?.data) ? paymentRequestsData.data : [];

  // Get payment request for a specific ad
  const getPaymentRequestForAd = (adId: number) => {
    return paymentRequests.find((pr) => pr.advertisement?.id === adId);
  };

  const handleCompletePayment = (ad: Advertisement) => {
    setSelectedAdForPayment(ad);
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedAdForPayment(null);
    setSelectedPlan(null);
    queryClient.invalidateQueries({ queryKey: ['user-ads'] });
    queryClient.invalidateQueries({ queryKey: ['payment-requests'] });
    queryClient.invalidateQueries({ queryKey: ['subscription-limit'] });
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-gray-600 text-sm">Draft/Pending</p>
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

      </div>

      {/* Subscription Info */}
      {subscriptionLimit?.data && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Subscription Status</h2>
          {subscriptionLimit.data.hasActiveSubscription ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-semibold text-gray-900">
                  {subscriptionLimit.data.subscription?.plan.name || 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Posts Used:</span>
                <span className="font-semibold text-gray-900">
                  {subscriptionLimit.data.postsUsed} / {subscriptionLimit.data.postsLimit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Posts Remaining:</span>
                <span className={`font-semibold ${subscriptionLimit.data.postsRemaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {subscriptionLimit.data.postsRemaining}
                </span>
              </div>
              {subscriptionLimit.data.subscription && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(subscriptionLimit.data.subscription.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">No active subscription</p>
              <Link
                to="/post-ad"
                className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Subscribe to Post Ads
              </Link>
            </div>
          )}
        </div>
      )}

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
                        {ad.status === 'draft' && (
                          <button
                            onClick={() => handleCompletePayment(ad)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold"
                            title="Complete Payment"
                          >
                            💳 Pay
                          </button>
                        )}
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
                        {ad.status === 'approved' && (
                          <button
                            onClick={() => handlePromote(ad)}
                            className="text-green-600 hover:text-green-800"
                            title="Promote"
                          >
                            📈
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                      {ad.status === 'draft' && getPaymentRequestForAd(ad.id) && (
                        <div className="mt-2">
                          <PaymentStatus paymentRequest={getPaymentRequestForAd(ad.id)!} />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal for Draft Ads */}
      {selectedAdForPayment && !showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Complete Payment for Ad</h2>
                <button
                  onClick={() => setSelectedAdForPayment(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Advertisement</h3>
                <p className="text-lg">{selectedAdForPayment.title}</p>
              </div>
              <PlanSelector
                onSelectPlan={handlePlanSelect}
                selectedPlanId={selectedPlan?.id}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Request Modal */}
      {showPaymentModal && selectedPlan && selectedAdForPayment && (
        <PaymentRequestModal
          plan={selectedPlan}
          advertisement={selectedAdForPayment}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
