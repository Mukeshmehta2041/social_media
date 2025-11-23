import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import type { Advertisement } from '../../types';

// Helper function to strip HTML tags and get plain text - memoized
const stripHtmlTags = (() => {
  const cache = new Map<string, string>();
  return (html: string): string => {
    if (cache.has(html)) {
      return cache.get(html)!;
    }
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    const result = tmp.textContent || tmp.innerText || '';
    cache.set(html, result);
    return result;
  };
})();

interface AdCardProps {
  ad: Advertisement;
}

const AdCard = memo(({ ad }: AdCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = useMemo(() => {
    return ad.images && ad.images.length > 0
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${ad.images[0].url}`
      : '/placeholder-image.jpg';
  }, [ad.images]);

  const whatsappNumber = useMemo(() => ad.whatsappNumber || ad.contactPhone, [ad.whatsappNumber, ad.contactPhone]);

  const descriptionText = useMemo(() => {
    if (!ad.description) return '';
    if (typeof ad.description === 'string') {
      return stripHtmlTags(ad.description);
    }
    if (typeof ad.description === 'object' && ad.description !== null) {
      return JSON.stringify(ad.description);
    }
    return '';
  }, [ad.description]);

  return (
    <Link
      to={`/ad/${ad.id}`}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all flex"
    >
      {/* Left Section - Small Profile Image */}
      <div className="relative w-20 h-20 min-w-[80px] bg-gray-200 shrink-0 m-4 rounded-full overflow-hidden">
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
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            setImageLoaded(true);
            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
          }}
        />
        {ad.isPremium && (
          <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold text-[10px]">
            Premium
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between relative">
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
          {descriptionText && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {descriptionText}
            </p>
          )}

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

          {/* Location */}
          <div className="flex items-center text-sm text-gray-500">
            {ad.city && (
              <span className="flex items-center">
                <HiLocationMarker className="w-4 h-4 mr-1" />
                {ad.city.name}
              </span>
            )}
          </div>

          {ad.category && (
            <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {ad.category.name}
            </span>
          )}
        </div>

        {/* WhatsApp Button - Bottom Right */}
        {whatsappNumber && (
          <div className="absolute bottom-4 right-4">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </Link>
  );
});

AdCard.displayName = 'AdCard';

export default AdCard;

