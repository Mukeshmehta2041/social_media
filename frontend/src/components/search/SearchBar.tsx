import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import type { Category, City } from '../../types';

interface SearchBarProps {
  variant?: 'default' | 'hero';
  onSearch?: (params: { q?: string; city?: string; category?: string }) => void;
}

const SearchBar = ({ variant = 'default', onSearch }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Initialize from URL params
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const category = searchParams.get('category') || '';
    setSearchQuery(q);
    setSelectedCity(city);
    setSelectedCategory(category);
  }, [searchParams]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories?filters[isActive][$eq]=true');
      return response.data;
    },
  });

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await api.get('/cities?filters[isActive][$eq]=true');
      return response.data;
    },
  });

  const categories = categoriesData?.data || [];
  const cities = citiesData?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedCity) params.append('city', selectedCity);
    if (selectedCategory) params.append('category', selectedCategory);

    if (onSearch) {
      onSearch({
        q: searchQuery || undefined,
        city: selectedCity || undefined,
        category: selectedCategory || undefined,
      });
    } else {
      navigate(`/search?${params.toString()}`);
    }
  };

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSearch}
      className={`${isHero
        ? 'bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto'
        : 'bg-gray-50 rounded-lg p-4'
        }`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for ads..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* City Select */}
        <div className="w-full md:w-48">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Cities</option>
            {cities.map((city: City) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-8 py-3 rounded-lg font-semibold transition whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

