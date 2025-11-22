import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import type { SubscriptionPlan, ApiResponse } from '../../types';

interface PlanSelectorProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  selectedPlanId?: number;
}

const PlanSelector = ({ onSelectPlan, selectedPlanId }: PlanSelectorProps) => {
  const { data: plansData, isLoading } = useQuery<ApiResponse<SubscriptionPlan[]>>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await api.get('/subscription-plans?filters[isActive][$eq]=true&sort=sortOrder:asc');
      return response.data;
    },
  });

  const plans = plansData?.data || [];

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case 'weekly':
        return 'Per Week';
      case 'monthly':
        return 'Per Month';
      case 'yearly':
        return 'Per Year';
      default:
        return duration;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading plans...</div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No subscription plans available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${selectedPlanId === plan.id
            ? 'border-indigo-600 ring-2 ring-indigo-200'
            : 'border-gray-200 hover:border-indigo-300'
            }`}
        >
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{getDurationLabel(plan.duration)}</p>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {plan.postLimit} {plan.postLimit === 1 ? 'post' : 'posts'} {getDurationLabel(plan.duration).toLowerCase()}
            </p>
          </div>

          {plan.features && typeof plan.features === 'object' && Object.keys(plan.features).length > 0 && (
            <ul className="mb-6 space-y-2">
              {Object.entries(plan.features).map(([key, value]) => (
                <li key={key} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{String(value)}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => onSelectPlan(plan)}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition ${selectedPlanId === plan.id
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
          >
            {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlanSelector;

