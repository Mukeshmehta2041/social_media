import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import ImageUpload from '../components/forms/ImageUpload';
import type { Category, City, Advertisement, Media } from '../types';

interface EditAdForm {
  title: string;
  description: string;
  price: string;
  category: string;
  city: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappNumber?: string;
}

const EditAd = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Media[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditAdForm>();

  // Fetch advertisement data
  const { data: adData, isLoading } = useQuery<{ data: Advertisement }>({
    queryKey: ['ad', id],
    queryFn: async () => {
      const response = await api.get(`/advertisements/${id}?populate=*`);
      return response.data;
    },
    enabled: !!id,
  });

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

  // Populate form when ad data loads
  useEffect(() => {
    if (adData?.data) {
      const ad = adData.data;

      // Check if user owns this ad
      const adUserId = ad.user?.id || ad.owner?.id;
      const isAdmin = user?.role?.type === 'admin';
      if (adUserId !== user?.id && !isAdmin) {
        navigate('/dashboard');
        return;
      }

      setValue('title', ad.title);
      setValue('description', typeof ad.description === 'string' ? ad.description : '');
      setValue('price', ad.price?.toString() || '');
      setValue('category', ad.category?.id?.toString() || '');
      setValue('city', ad.city?.id?.toString() || '');
      setValue('contactPhone', ad.contactPhone || '');
      setValue('contactEmail', ad.contactEmail || '');
      setValue('whatsappNumber', ad.whatsappNumber || ad.contactPhone || '');

      if (ad.images) {
        setExistingImages(Array.isArray(ad.images) ? ad.images : []);
      }
    }
  }, [adData, setValue, user, navigate]);

  const categories = categoriesData?.data || [];
  const cities = citiesData?.data || [];

  const updateAdMutation = useMutation({
    mutationFn: async (data: EditAdForm) => {
      // Upload new images if any
      let newImageIds: number[] = [];
      if (images.length > 0) {
        const uploadFormData = new FormData();
        images.forEach((image) => {
          uploadFormData.append('files', image);
        });

        const uploadResponse = await api.post('/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        newImageIds = uploadResponse.data.map((file: { id: number }) => file.id);
      }

      // Combine existing and new image IDs
      const allImageIds = [
        ...existingImages.map((img) => img.id),
        ...newImageIds,
      ];

      // Update the advertisement
      const adData = {
        data: {
          title: data.title,
          description: data.description,
          price: parseFloat(data.price) || 0,
          category: data.category,
          city: data.city,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail || '',
          whatsappNumber: data.whatsappNumber || data.contactPhone,
          images: allImageIds,
        },
      };

      const response = await api.put(`/advertisements/${id}`, adData);
      return response.data;
    },
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Failed to update advertisement');
    },
  });

  const onSubmit = async (data: EditAdForm) => {
    setError(null);
    setLoading(true);

    try {
      await updateAdMutation.mutateAsync(data);
    } catch {
      // Error handled in mutation
    } finally {
      setLoading(false);
    }
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!adData?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Advertisement not found</h1>
        </div>
      </div>
    );
  }

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:1337';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Edit Advertisement</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' },
              maxLength: { value: 100, message: 'Title must be less than 100 characters' },
            })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' },
            })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹)
          </label>
          <input
            {...register('price', {
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: 'Please enter a valid price',
              },
            })}
            type="number"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <select
              {...register('city', { required: 'City is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a city</option>
              {cities.map((city: City) => (
                <option key={city.id} value={city.id}>
                  {city.name} {city.state && `, ${city.state}`}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Images
          </label>
          {existingImages.length > 0 ? (
            <div className="grid grid-cols-4 gap-4 mb-4">
              {existingImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={`${baseUrl}${image.url}`}
                    alt={image.alternativeText || 'Ad image'}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">No existing images</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add More Images
          </label>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={10 - existingImages.length}
            maxSizeMB={5}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register('contactPhone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                message: 'Please enter a valid phone number',
              },
            })}
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              {...register('whatsappNumber')}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="+91 1234567890 (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              {...register('contactEmail', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com (optional)"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Advertisement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAd;
