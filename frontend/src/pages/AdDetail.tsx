import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { Advertisement } from '../types';
import ImageGallery from '../components/ads/ImageGallery';
import ContactSection from '../components/ads/ContactSection';
import SEOHead from '../components/seo/SEOHead';

const AdDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<{ data: Advertisement }>({
    queryKey: ['ad', id],
    queryFn: () => api.get(`/advertisements/${id}?populate=*`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const ad = data?.data;

  if (!ad) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Advertisement not found</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={ad.title}
        description={typeof ad.description === 'string' ? ad.description.substring(0, 160) : 'View advertisement details'}
        image={ad.images && ad.images.length > 0 ? `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${ad.images[0].url}` : undefined}
        url={`${window.location.origin}/ad/${ad.id}`}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-600">
          <ol className="flex space-x-2">
            <li>
              <a href="/" className="hover:text-indigo-600">
                Home
              </a>
            </li>
            <li>/</li>
            {ad.city && (
              <>
                <li>
                  <a
                    href={`/call-girls/${ad.city.slug}`}
                    className="hover:text-indigo-600"
                  >
                    {ad.city.name}
                  </a>
                </li>
                <li>/</li>
              </>
            )}
            {ad.category && (
              <>
                <li>
                  <a
                    href={`/category/${ad.category.slug}`}
                    className="hover:text-indigo-600"
                  >
                    {ad.category.name}
                  </a>
                </li>
                <li>/</li>
              </>
            )}
            <li className="text-gray-900">{ad.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ImageGallery images={ad.images || []} />
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{ad.title}</h1>
                  {ad.price && (
                    <p className="text-3xl font-bold text-indigo-600">
                      ₹{ad.price.toLocaleString()}
                    </p>
                  )}
                </div>
                {ad.isPremium && (
                  <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Premium
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {ad.category && (
                  <a
                    href={`/category/${ad.category.slug}`}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 transition"
                  >
                    {ad.category.name}
                  </a>
                )}
                {ad.city && (
                  <a
                    href={`/call-girls/${ad.city.slug}`}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition flex items-center gap-1"
                  >
                    <span>📍</span>
                    {ad.city.name}
                  </a>
                )}
              </div>
              <div className="prose max-w-none mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <div
                  className="text-gray-700 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: typeof ad.description === 'string' ? ad.description : '',
                  }}
                />
              </div>
              <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
                <div>
                  <p>Posted: {new Date(ad.createdAt).toLocaleDateString()}</p>
                  {ad.updatedAt !== ad.createdAt && (
                    <p>Updated: {new Date(ad.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
                {ad.viewCount > 0 && (
                  <p className="flex items-center gap-1">
                    <span>👁️</span>
                    {ad.viewCount} views
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <ContactSection ad={ad} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdDetail;

