import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Category, Advertisement, ApiResponse } from '../types';
import AdCard from '../components/ads/AdCard';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: categoryData } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await api.get(`/categories?filters[slug][$eq]=${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  const { data: adsData } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['category-ads', slug],
    queryFn: async () => {
      const response = await api.get(`/advertisements?filters[category][slug][$eq]=${slug}&filters[status][$eq]=approved&populate=category,city,images`);
      return response.data;
    },
    enabled: !!slug,
  });

  const category = categoryData?.data?.[0];
  const ads = Array.isArray(adsData?.data) ? adsData.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {category && (
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>
      )}

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found in this category</p>
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

export default CategoryPage;

