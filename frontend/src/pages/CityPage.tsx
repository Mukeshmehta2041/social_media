import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiArrowLeft } from 'react-icons/hi';
import api from '../services/api';
import type { City, Advertisement, ApiResponse } from '../types';
import AdCard from '../components/ads/AdCard';

const CityPage = () => {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();

  const { data: cityData } = useQuery<ApiResponse<City[]>>({
    queryKey: ['city', city],
    queryFn: async () => {
      const response = await api.get(`/cities?filters[slug][$eq]=${city}`);
      return response.data;
    },
    enabled: !!city,
  });

  const { data: adsData } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['city-ads', city],
    queryFn: async () => {
      const response = await api.get(`/advertisements/city/${city}?populate=category,city,images`);
      return response.data;
    },
    enabled: !!city,
  });

  const cityInfo = cityData?.data?.[0];
  const ads = Array.isArray(adsData?.data) ? adsData.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <HiArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      {cityInfo && (
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Listings in {cityInfo.name}
          </h1>
          {cityInfo.state && (
            <p className="text-gray-600">{cityInfo.state}, {cityInfo.country}</p>
          )}
        </div>
      )}

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found in this city</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CityPage;

