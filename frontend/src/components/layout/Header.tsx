import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { HiChevronDown, HiLocationMarker } from 'react-icons/hi';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { City } from '../../types';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await api.get('/cities?filters[isActive][$eq]=true&sort=name:asc');
      return response.data;
    },
  });

  const cities = citiesData?.data || [];

  // Group cities by state
  const citiesByState = cities.reduce((acc: Record<string, City[]>, city: City) => {
    const state = city.state || 'Other';
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(city);
    return acc;
  }, {});

  // Filter cities based on search query
  const filteredCitiesByState = Object.entries(citiesByState).reduce(
    (acc: Record<string, City[]>, [state, stateCities]) => {
      const cities = stateCities as City[];
      const filtered = cities.filter((city: City) =>
        city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
        (city.state && city.state.toLowerCase().includes(citySearchQuery.toLowerCase()))
      );
      if (filtered.length > 0) {
        acc[state] = filtered;
      }
      return acc;
    },
    {}
  );

  const handleCitySelect = (citySlug: string) => {
    navigate(`/call-girls/${citySlug}`);
    setCitySearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">YourSite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </Link>

            {/* City Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                <HiLocationMarker className="w-5 h-5" />
                <span>Select City</span>
                <HiChevronDown className="w-4 h-4" />
              </Menu.Button>
              <Menu.Items className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {Object.entries(filteredCitiesByState).map(([state, stateCities]) => (
                    <div key={state} className="py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                        {state}
                      </div>
                      {stateCities.map((city) => (
                        <Menu.Item key={city.id}>
                          {({ active }) => (
                            <button
                              onClick={() => handleCitySelect(city.slug)}
                              className={`${active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                                } w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors`}
                            >
                              {city.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  ))}
                  {Object.keys(filteredCitiesByState).length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No cities found
                    </div>
                  )}
                </div>
              </Menu.Items>
            </Menu>

            <Link to="/search" className="text-gray-700 hover:text-indigo-600">
              Search
            </Link>
            {isAuthenticated && (
              <Link to="/post-ad" className="text-gray-700 hover:text-indigo-600">
                Post Ad
              </Link>
            )}
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600">
              Contact
            </Link>
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                    <span>{user?.username}</span>
                    <svg
                      className="w-4 h-4"
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div className="px-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select City
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      navigate(`/call-girls/${e.target.value}`);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Cities</option>
                  {Object.entries(citiesByState).map(([state, stateCities]) => {
                    const cities = stateCities as City[];
                    return (
                      <optgroup key={state} label={state}>
                        {cities.map((city: City) => (
                          <option key={city.id} value={city.slug}>
                            {city.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
              <Link
                to="/search"
                className="text-gray-700 hover:text-indigo-600 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/post-ad"
                    className="text-gray-700 hover:text-indigo-600 px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Post Ad
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-indigo-600 px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-indigo-600 px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="text-gray-700 hover:text-indigo-600 px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-indigo-600 px-2"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mx-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              <Link
                to="/contact"
                className="text-gray-700 hover:text-indigo-600 px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

