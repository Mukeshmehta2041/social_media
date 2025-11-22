import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Advertisement, ApiResponse } from '../types';
import AdCard from '../components/ads/AdCard';

const CityCategoryPage = () => {
  const { city, category } = useParams<{ city: string; category?: string }>();

  const { data: adsData } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['city-category-ads', city, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        'filters[status][$eq]': 'approved',
      });
      if (city) params.append('filters[city][slug][$eq]', city);
      if (category) params.append('filters[category][slug][$eq]', category);
      params.append('populate', 'category,city,images');
      const response = await api.get(`/advertisements?${params.toString()}`);
      return response.data;
    },
    enabled: !!city,
  });

  const ads = Array.isArray(adsData?.data) ? adsData.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {category ? `${category} in ${city}` : `Listings in ${city}`}
      </h1>

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CityCategoryPage;

