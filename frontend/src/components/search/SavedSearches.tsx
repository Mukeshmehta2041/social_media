import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import type { SavedSearch, ApiResponse } from '../../types';

interface SavedSearchesProps {
  onSelectSearch?: (searchQuery: any) => void;
}

const SavedSearches = ({ onSelectSearch }: SavedSearchesProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ApiResponse<SavedSearch[]>>({
    queryKey: ['saved-searches', user?.id],
    queryFn: async () => {
      const response = await api.get('/saved-searches?populate=*&sort=createdAt:desc');
      return response.data;
    },
    enabled: isAuthenticated && !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/saved-searches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
    },
  });

  const toggleNotificationsMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      await api.put(`/saved-searches/${id}`, {
        data: { notificationsEnabled: enabled },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
        <p className="text-gray-500 text-sm">Please log in to save searches</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  const savedSearches = data?.data || [];

  if (savedSearches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
        <p className="text-gray-500 text-sm">No saved searches yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
      <div className="space-y-3">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900">{search.name}</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectSearch) {
                      onSelectSearch(search.searchQuery);
                    }
                  }}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                  title="Run this search"
                >
                  🔍
                </button>
                <button
                  onClick={() => deleteMutation.mutate(search.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  title="Delete"
                  disabled={deleteMutation.isPending}
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {search.searchQuery.q && (
                <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                  {search.searchQuery.q}
                </span>
              )}
              {search.searchQuery.category && (
                <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                  Category: {search.searchQuery.category}
                </span>
              )}
              {search.searchQuery.city && (
                <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">
                  {search.searchQuery.city}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(search.createdAt).toLocaleDateString()}
              </span>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={search.notificationsEnabled}
                  onChange={(e) =>
                    toggleNotificationsMutation.mutate({
                      id: search.id,
                      enabled: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span>Notifications</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSearches;

