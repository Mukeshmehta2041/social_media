import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import type { Advertisement, ApiResponse } from '../../types';
import AdCard from './AdCard';

interface RelatedAdsProps {
  currentAdId: number;
  categoryId?: number;
  cityId?: number;
  limit?: number;
}

const RelatedAds = ({ currentAdId, limit = 6 }: RelatedAdsProps) => {
  const { data: relatedAdsData } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['related-ads', currentAdId],
    queryFn: async () => {
      const response = await api.get(
        `/advertisements/${currentAdId}/related?limit=${limit}`
      );
      return response.data;
    },
    enabled: !!currentAdId,
  });

  const relatedAds = relatedAdsData?.data || [];

  if (relatedAds.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Related Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
};

export default RelatedAds;

