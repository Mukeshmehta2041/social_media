import { useParams, Navigate } from 'react-router-dom';
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
      const response = await api.get(`/advertisements/category/${slug}?populate=category,city,images`);
      return response.data;
    },
    enabled: !!slug,
  });

  // Redirect to home if no slug
  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const category = categoryData?.data?.[0];
  const ads = Array.isArray(adsData?.data) ? adsData.data : [];

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <p className="text-gray-500 mb-4">The category you're looking for doesn't exist.</p>
          <a href="/" className="text-indigo-600 hover:text-indigo-800">
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found in this category</p>
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

export default CategoryPage;

