import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiEye, HiClock } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import type { Advertisement } from '../../types';

interface AdCardProps {
  ad: Advertisement;
}

const AdCard = ({ ad }: AdCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = ad.images && ad.images.length > 0
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${ad.images[0].url}`
    : '/placeholder-image.jpg';

  return (
    <Link
      to={`/ad/${ad.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 bg-gray-200">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-300 w-full h-full" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={ad.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            setImageLoaded(true);
            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
          }}
        />
        {ad.isPremium && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">
            Premium
          </span>
        )}
        {ad.images && ad.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {ad.images.length} photos
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">{ad.title}</h3>
          {ad.age && (
            <span className="ml-2 text-sm font-medium text-indigo-600 whitespace-nowrap">
              {ad.age} Years
            </span>
          )}
        </div>

        {/* Pricing Tiers */}
        <div className="mb-3">
          {ad.priceOneHour || ad.priceTwoHour || ad.priceThreeHour || ad.priceFullNight ? (
            <div className="flex flex-wrap gap-2 text-sm">
              {ad.priceOneHour && (
                <span className="text-gray-700">
                  <span className="font-semibold text-indigo-600">1H:</span> ₹{ad.priceOneHour.toLocaleString()}
                </span>
              )}
              {ad.priceTwoHour && (
                <span className="text-gray-700">
                  <span className="font-semibold text-indigo-600">2H:</span> ₹{ad.priceTwoHour.toLocaleString()}
                </span>
              )}
              {ad.priceThreeHour && (
                <span className="text-gray-700">
                  <span className="font-semibold text-indigo-600">3H:</span> ₹{ad.priceThreeHour.toLocaleString()}
                </span>
              )}
              {ad.priceFullNight && (
                <span className="text-gray-700">
                  <span className="font-semibold text-indigo-600">Night:</span> ₹{ad.priceFullNight.toLocaleString()}
                </span>
              )}
            </div>
          ) : ad.price ? (
            <p className="text-indigo-600 font-bold text-xl mb-2">
              ₹{ad.price.toLocaleString()}
            </p>
          ) : null}
        </div>

        {/* Service Locations & Availability */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs">
          {ad.serviceLocations && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {ad.serviceLocations === 'home' ? 'Home' : ad.serviceLocations === 'hotel' ? 'Hotel' : 'Home & Hotel'}
            </span>
          )}
          {ad.availability && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {ad.availability}
            </span>
          )}
        </div>

        {/* Location, Views, Date */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          {ad.city && (
            <span className="flex items-center">
              <HiLocationMarker className="w-4 h-4 mr-1" />
              {ad.city.name}
            </span>
          )}
          <div className="flex items-center gap-3">
            {ad.viewCount > 0 && (
              <span className="flex items-center">
                <HiEye className="w-4 h-4 mr-1" />
                {ad.viewCount}
              </span>
            )}
            {ad.createdAt && (
              <span className="flex items-center">
                <HiClock className="w-4 h-4 mr-1" />
                {formatDistanceToNow(new Date(ad.createdAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        {ad.category && (
          <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {ad.category.name}
          </span>
        )}
      </div>
    </Link>
  );
};

export default AdCard;

