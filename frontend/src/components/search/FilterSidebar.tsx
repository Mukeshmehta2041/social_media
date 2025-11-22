import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import type { Category, City } from '../../types';

interface FilterSidebarProps {
  onFilterChange: (filters: {
    category?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }) => void;
  currentFilters: {
    category?: string;
    city?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  };
}

const FilterSidebar = ({ onFilterChange, currentFilters }: FilterSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...currentFilters,
      [key]: value || undefined,
    });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-between"
        >
          <span>Filters</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filter Sidebar */}
      <aside
        className={`${isOpen ? 'block' : 'hidden'
          } md:block bg-white rounded-lg shadow-md p-6 mb-6 md:mb-0`}
      >
        <h3 className="text-lg font-semibold mb-4">Filters</h3>

        {/* Sort */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={currentFilters.sort || 'newest'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={currentFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <select
            value={currentFilters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Cities</option>
            {cities.map((city: City) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={currentFilters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={currentFilters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            onFilterChange({});
            setIsOpen(false);
          }}
          className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>
      </aside>
    </>
  );
};

export default FilterSidebar;

