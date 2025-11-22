import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiEye, HiClock } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
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

  const phoneNumber = ad.contactPhone || ad.whatsappNumber;
  const whatsappNumber = ad.whatsappNumber || ad.contactPhone;

  return (
    <Link
      to={`/ad/${ad.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all flex"
    >
      {/* Left Section - Image */}
      <div className="relative w-1/3 min-w-[200px] bg-gray-200 flex-shrink-0">
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
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            {ad.images.length} Photos
          </span>
        )}
      </div>

      {/* Middle Section - Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1 pr-2">{ad.title}</h3>
            {ad.age && (
              <span className="text-sm font-medium text-indigo-600 whitespace-nowrap">
                Age {ad.age}
              </span>
            )}
          </div>

          {/* Description Preview */}
          {ad.description && typeof ad.description === 'string' && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {ad.description}
            </p>
          )}

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
          <div className="flex items-center justify-between text-sm text-gray-500">
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
      </div>

      {/* Right Section - Contact Info */}
      {phoneNumber && (
        <div className="w-32 flex-shrink-0 p-4 flex flex-col items-center justify-center bg-gray-50 border-l border-gray-200">
          <div className="bg-white rounded-lg px-3 py-2 mb-3 text-center shadow-sm">
            <p className="text-sm font-semibold text-gray-800">{phoneNumber}</p>
          </div>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
          )}
        </div>
      )}
    </Link>
  );
};

export default AdCard;

