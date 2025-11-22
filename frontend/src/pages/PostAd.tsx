import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import ImageUpload from '../components/forms/ImageUpload';
import type { Category, City } from '../types';

interface PostAdForm {
  title: string;
  description: string;
  price: string;
  category: string;
  city: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappNumber?: string;
}

const PostAd = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostAdForm>();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

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

  const createAdMutation = useMutation({
    mutationFn: async (data: PostAdForm) => {
      // First, upload images if any
      let uploadedImages: number[] = [];
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

        uploadedImages = uploadResponse.data.map((file: any) => file.id);
      }

      // Then create the advertisement with image IDs
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
          status: 'pending',
          images: uploadedImages,
        },
      };

      const response = await api.post('/advertisements', adData);
      return response.data;
    },
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to create advertisement');
    },
  });

  const onSubmit = async (data: PostAdForm) => {
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await createAdMutation.mutateAsync(data);
    } catch (err) {
      // Error handled in mutation
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const selectedCategory = watch('category');
  const selectedCity = watch('city');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Post an Advertisement</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div key={stepNum} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= stepNum
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {stepNum}
              </div>
              {stepNum < 5 && (
                <div
                  className={`flex-1 h-1 mx-2 ${step > stepNum ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Basic Info</span>
          <span>Category & Location</span>
          <span>Images</span>
          <span>Contact</span>
          <span>Review</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
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
                placeholder="Enter advertisement title"
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
                placeholder="Describe your advertisement in detail..."
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
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Category & Location */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Category & Location</h2>
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
        )}

        {/* Step 3: Images */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Images</h2>
            <p className="text-gray-600 mb-4">
              Add photos to make your advertisement more attractive. You can upload up to 10 images.
            </p>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
              maxSizeMB={5}
            />
          </div>
        )}

        {/* Step 4: Contact Information */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
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
                placeholder="+91 1234567890"
              />
              {errors.contactPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
              )}
            </div>

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
              <p className="mt-1 text-sm text-gray-500">
                If different from phone number
              </p>
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
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Review & Submit</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Title</h3>
                <p className="text-gray-900">{watch('title')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Description</h3>
                <p className="text-gray-900 whitespace-pre-line">{watch('description')}</p>
              </div>
              {watch('price') && (
                <div>
                  <h3 className="font-semibold text-gray-700">Price</h3>
                  <p className="text-gray-900">₹{parseFloat(watch('price') || '0').toLocaleString()}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-700">Category</h3>
                <p className="text-gray-900">
                  {categories.find((c: Category) => c.id.toString() === selectedCategory)?.name || 'Not selected'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">City</h3>
                <p className="text-gray-900">
                  {cities.find((c: City) => c.id.toString() === selectedCity)?.name || 'Not selected'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Contact Phone</h3>
                <p className="text-gray-900">{watch('contactPhone')}</p>
              </div>
              {watch('whatsappNumber') && (
                <div>
                  <h3 className="font-semibold text-gray-700">WhatsApp</h3>
                  <p className="text-gray-900">{watch('whatsappNumber')}</p>
                </div>
              )}
              {watch('contactEmail') && (
                <div>
                  <h3 className="font-semibold text-gray-700">Email</h3>
                  <p className="text-gray-900">{watch('contactEmail')}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-700">Images</h3>
                <p className="text-gray-900">{images.length} image(s) uploaded</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Advertisement'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostAd;
