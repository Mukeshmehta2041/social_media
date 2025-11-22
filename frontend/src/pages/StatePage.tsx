import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { City, ApiResponse } from '../types';
import SEOHead from '../components/seo/SEOHead';

const StatePage = () => {
  const { state } = useParams<{ state: string }>();

  const { data: citiesData } = useQuery<ApiResponse<City[]>>({
    queryKey: ['state-cities', state],
    queryFn: async () => {
      const response = await api.get(`/cities?filters[state][$eq]=${state}&filters[isActive][$eq]=true&sort=name:asc`);
      return response.data;
    },
    enabled: !!state,
  });

  const cities = citiesData?.data || [];
  const stateName = state ? state.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';

  return (
    <>
      <SEOHead
        title={`Call Girls in ${stateName}`}
        description={`Browse call girls and escorts in ${stateName}. Find listings in cities across ${stateName}.`}
        keywords={`${stateName}, call girls, escorts, ${stateName} cities`}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Call Girls in {stateName}
          </h1>
          <p className="text-gray-600">
            Browse listings by city in {stateName}
          </p>
        </div>

        {cities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cities found in this state</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cities.map((city) => (
              <Link
                key={city.id}
                to={`/call-girls/${city.slug}`}
                className="bg-white p-4 rounded-lg text-center hover:bg-indigo-50 transition shadow-sm"
              >
                <h3 className="font-semibold text-gray-800 hover:text-indigo-600">
                  {city.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StatePage;

