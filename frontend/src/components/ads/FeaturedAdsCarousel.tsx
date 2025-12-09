import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiChevronLeft, HiChevronRight, HiLocationMarker } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import type { Advertisement, ApiResponse } from '../../types';

interface FeaturedAdsCarouselProps {
  limit?: number;
  autoRotateInterval?: number;
}

const FeaturedAdsCarousel = ({ limit = 6, autoRotateInterval = 5000 }: FeaturedAdsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: featuredAdsData } = useQuery<ApiResponse<Advertisement[]>>({
    queryKey: ['featured-ads-carousel'],
    queryFn: async () => {
      const response = await api.get(
        `/advertisements?filters[isPremium][$eq]=true&filters[status][$eq]=approved&populate=category,city,images&pagination[limit]=${limit}&sort=createdAt:desc`
      );
      return response.data;
    },
  });

  const featuredAds = featuredAdsData?.data || [];

  useEffect(() => {
    if (featuredAds.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAds.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [featuredAds.length, autoRotateInterval]);

  if (featuredAds.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredAds.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredAds.length) % featuredAds.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Base64 encoded placeholder image
  const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

  const currentAd = featuredAds[currentIndex];
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337';
  const imageUrl = currentAd.images && currentAd.images.length > 0
    ? `${baseUrl}${currentAd.images[0].url}`
    : PLACEHOLDER_IMAGE;

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg overflow-hidden shadow-xl">
      <div className="relative h-96">
        <img
          src={imageUrl}
          alt={currentAd.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Use data URI placeholder to prevent infinite loop
            const target = e.target as HTMLImageElement;
            if (target.src !== PLACEHOLDER_IMAGE) {
              target.src = PLACEHOLDER_IMAGE;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded mb-2">
              VIP PRIME STORY
            </span>
            <Link to={`/ad/${currentAd.id}`}>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 hover:text-yellow-300 transition-colors">
                {currentAd.title}
              </h2>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              {currentAd.city && (
                <span className="flex items-center">
                  <HiLocationMarker className="w-4 h-4 mr-1" />
                  {currentAd.city.name}
                </span>
              )}
              {currentAd.age && (
                <span>{currentAd.age} Years</span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {featuredAds.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Previous"
            >
              <HiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Next"
            >
              <HiChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {featuredAds.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {featuredAds.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-yellow-500 w-8' : 'bg-white/50 hover:bg-white/75'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedAdsCarousel;

