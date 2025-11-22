import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Category, City, Advertisement, ApiResponse } from '../types';
import AdCard from '../components/ads/AdCard';

const Home = () => {
  const { data: categoriesData } = useQuery<ApiResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories?filters[isActive][$eq]=true');
      return response.data;
    },
  });

  const { data: citiesData } = useQuery<ApiResponse<City[]>>({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await api.get('/cities?filters[isActive][$eq]=true');
      return response.data;
    },
  });

  const { data: featuredAdsData } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['featured-ads'],
    queryFn: async () => {
      const response = await api.get('/advertisements?filters[isPremium][$eq]=true&filters[status][$eq]=approved&pagination[limit]=6');
      return response.data;
    },
  });

  const { data: recentAdsData } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['recent-ads'],
    queryFn: async () => {
      const response = await api.get('/advertisements?filters[status][$eq]=approved&sort=createdAt:desc&pagination[limit]=12');
      return response.data;
    },
  });

  const categories = categoriesData?.data || [];
  const cities = citiesData?.data || [];
  const featuredAds = featuredAdsData?.data || [];
  const recentAds = recentAdsData?.data || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find What You're Looking For
            </h1>
            <p className="text-xl mb-8">
              Browse thousands of listings in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Browse Listings
              </Link>
              <Link
                to="/post-ad"
                className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition"
              >
                Post an Ad
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((category: Category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="bg-gray-50 p-6 rounded-lg text-center hover:bg-indigo-50 transition group"
              >
                <div className="text-4xl mb-3">{category.icon || '📋'}</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cities.slice(0, 12).map((city: City) => (
              <Link
                key={city.id}
                to={`/call-girls/${city.slug}`}
                className="bg-white p-4 rounded-lg text-center hover:bg-indigo-50 transition group shadow-sm"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600">
                  {city.name}
                </h3>
                {city.state && (
                  <p className="text-sm text-gray-500">{city.state}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      {featuredAds.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAds.map((ad: Advertisement) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Ads */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentAds.map((ad: Advertisement) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/search"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

