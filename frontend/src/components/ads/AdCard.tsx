import { useState } from 'react';
import { Link } from 'react-router-dom';
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
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Premium
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{ad.title}</h3>
        {ad.price && (
          <p className="text-indigo-600 font-bold text-xl mb-2">
            ₹{ad.price.toLocaleString()}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          {ad.city && (
            <span className="flex items-center">
              📍 {ad.city.name}
            </span>
          )}
          {ad.viewCount > 0 && (
            <span>{ad.viewCount} views</span>
          )}
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

