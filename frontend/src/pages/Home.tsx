import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { City, Advertisement, ApiResponse } from '../types';
import AdCard from '../components/ads/AdCard';
import SEOHead from '../components/seo/SEOHead';

const Home = () => {
  const { data: citiesData } = useQuery<ApiResponse<City[]>>({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await api.get('/cities?filters[isActive][$eq]=true');
      return response.data;
    },
  });

  const { data: allAdsData, isLoading } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['all-ads'],
    queryFn: async () => {
      const response = await api.get('/advertisements?filters[status][$eq]=approved&populate=category,city,images&sort=createdAt:desc&pagination[limit]=100');
      return response.data;
    },
  });

  const cities = citiesData?.data || [];
  const allAds = allAdsData?.data || [];

  return (
    <>
      <SEOHead
        title="Home"
        description="Browse thousands of classified advertisements. Find what you're looking for or post your own ad today."
        keywords="classified ads, buy, sell, listings, advertisements"
      />
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

        {/* All Listings */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">All Listings</h2>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading listings...</p>
              </div>
            ) : allAds.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No listings available at the moment</p>
                <Link
                  to="/post-ad"
                  className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Post Your First Ad
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {allAds.map((ad: Advertisement) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

