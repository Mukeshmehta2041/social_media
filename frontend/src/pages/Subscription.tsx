import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { UserSubscription, ApiResponse, SubscriptionLimitCheck } from '../types';

const Subscription = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Fetch subscription limit
  const { data: subscriptionLimit } = useQuery<{ data: SubscriptionLimitCheck }>({
    queryKey: ['subscription-limit', user?.id],
    queryFn: async () => {
      const response = await api.get('/user-subscriptions/check-limit');
      return response.data;
    },
    enabled: isAuthenticated && !!user,
  });

  // Fetch user subscriptions
  const { data: subscriptionsData, isLoading } = useQuery<ApiResponse<UserSubscription[]>>({
    queryKey: ['user-subscriptions', user?.id],
    queryFn: async () => {
      const response = await api.get('/user-subscriptions?populate=*&sort=createdAt:desc');
      return response.data;
    },
    enabled: isAuthenticated && !!user,
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your subscriptions</p>
          <Link
            to="/login"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const subscriptions = Array.isArray(subscriptionsData?.data) ? subscriptionsData.data : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Subscriptions</h1>

      {/* Current Subscription Status */}
      {subscriptionLimit?.data && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current Status</h2>
          {subscriptionLimit.data.hasActiveSubscription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Plan</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {subscriptionLimit.data.subscription?.plan.name || 'Active'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-lg font-semibold text-green-600">Active</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Posts Used</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {subscriptionLimit.data.postsUsed} / {subscriptionLimit.data.postsLimit}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{
                        width: `${(subscriptionLimit.data.postsUsed / subscriptionLimit.data.postsLimit) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Posts Remaining</label>
                  <p
                    className={`text-lg font-semibold ${
                      subscriptionLimit.data.postsRemaining > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {subscriptionLimit.data.postsRemaining}
                  </p>
                </div>
              </div>
              {subscriptionLimit.data.subscription && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Date</label>
                    <p className="text-gray-900">
                      {new Date(subscriptionLimit.data.subscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Expires</label>
                    <p className="text-gray-900">
                      {new Date(subscriptionLimit.data.subscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You don't have an active subscription</p>
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

      {/* Subscription History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Subscription History</h2>

        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No subscription history</p>
            <Link
              to="/post-ad"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className={`border rounded-lg p-4 ${
                  subscription.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{subscription.subscriptionPlan.name}</h3>
                    <p className="text-sm text-gray-600">
                      {subscription.postsUsed} / {subscription.postsLimit} posts used
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      subscription.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {subscription.isActive ? 'Active' : 'Expired'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Start:</span>{' '}
                    <span className="text-gray-900">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">End:</span>{' '}
                    <span className="text-gray-900">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;

