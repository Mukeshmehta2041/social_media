import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import ImageUpload from '../components/forms/ImageUpload';
import PlanSelector from '../components/subscription/PlanSelector';
import PaymentRequestModal from '../components/subscription/PaymentRequestModal';
import type { Category, City, SubscriptionPlan, Advertisement, PaymentRequest } from '../types';

const schema = yup.object({
  title: yup.string().required('Title is required').min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  price: yup.string().optional().matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price'),
  age: yup.string().optional().matches(/^\d+$/, 'Please enter a valid age').test('min-age', 'Age must be at least 18', (value) => !value || parseInt(value) >= 18).test('max-age', 'Please enter a valid age', (value) => !value || parseInt(value) <= 100),
  priceOneHour: yup.string().optional().matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price'),
  priceTwoHour: yup.string().optional().matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price'),
  priceThreeHour: yup.string().optional().matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price'),
  priceFullNight: yup.string().optional().matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price'),
  serviceLocations: yup.string().optional().oneOf(['home', 'hotel', 'both'], 'Invalid service location'),
  availability: yup.string().optional(),
  serviceTypes: yup.array().of(yup.string()).optional(),
  category: yup.string().required('Category is required'),
  city: yup.string().required('City is required'),
  contactPhone: yup.string().required('Phone number is required').matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please enter a valid phone number'),
  contactEmail: yup.string().optional().email('Please enter a valid email address'),
  whatsappNumber: yup.string().optional().matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please enter a valid phone number'),
});

interface PostAdForm {
  title: string;
  description: string;
  price: string;
  age?: string;
  priceOneHour?: string;
  priceTwoHour?: string;
  priceThreeHour?: string;
  priceFullNight?: string;
  serviceLocations?: 'home' | 'hotel' | 'both';
  availability?: string;
  serviceTypes?: string[];
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
  const [createdAd, setCreatedAd] = useState<Advertisement | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostAdForm>({
    resolver: yupResolver(schema) as any,
  });

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
          price: data.price ? parseFloat(data.price) : undefined,
          age: data.age ? parseInt(data.age) : undefined,
          priceOneHour: data.priceOneHour ? parseFloat(data.priceOneHour) : undefined,
          priceTwoHour: data.priceTwoHour ? parseFloat(data.priceTwoHour) : undefined,
          priceThreeHour: data.priceThreeHour ? parseFloat(data.priceThreeHour) : undefined,
          priceFullNight: data.priceFullNight ? parseFloat(data.priceFullNight) : undefined,
          serviceLocations: data.serviceLocations || 'both',
          availability: data.availability || undefined,
          serviceTypes: data.serviceTypes || undefined,
          category: data.category,
          city: data.city,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail || '',
          whatsappNumber: data.whatsappNumber || data.contactPhone,
          status: 'draft',
          images: uploadedImages,
        },
      };

      const response = await api.post('/advertisements', adData);
      return response.data;
    },
    onSuccess: (data) => {
      setCreatedAd(data.data);
      setStep(6); // Move to plan selection step
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

    if (step === 5) {
      // Submit the ad as draft
      setError(null);
      setLoading(true);

      try {
        await createAdMutation.mutateAsync(data);
      } catch (err) {
        // Error handled in mutation
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentRequest: PaymentRequest) => {
    setShowPaymentModal(false);
    navigate('/dashboard', { state: { paymentRequestId: paymentRequest.id } });
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
          {[1, 2, 3, 4, 5, 6].map((stepNum) => (
            <div key={stepNum} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= stepNum
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                  }`}
              >
                {stepNum}
              </div>
              {stepNum < 6 && (
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
          <span>Plan</span>
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
                Age
              </label>
              <input
                {...register('age')}
                type="number"
                min="18"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Age (optional)"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) - General
              </label>
              <input
                {...register('price')}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00 (optional)"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1 Hour (₹)
                </label>
                <input
                  {...register('priceOneHour')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
                {errors.priceOneHour && (
                  <p className="mt-1 text-sm text-red-600">{errors.priceOneHour.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2 Hours (₹)
                </label>
                <input
                  {...register('priceTwoHour')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
                {errors.priceTwoHour && (
                  <p className="mt-1 text-sm text-red-600">{errors.priceTwoHour.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3 Hours (₹)
                </label>
                <input
                  {...register('priceThreeHour')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
                {errors.priceThreeHour && (
                  <p className="mt-1 text-sm text-red-600">{errors.priceThreeHour.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Night (₹)
                </label>
                <input
                  {...register('priceFullNight')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
                {errors.priceFullNight && (
                  <p className="mt-1 text-sm text-red-600">{errors.priceFullNight.message}</p>
                )}
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Locations
              </label>
              <select
                {...register('serviceLocations')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="both">Both (Home & Hotel)</option>
                <option value="home">Home Only</option>
                <option value="hotel">Hotel Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <input
                {...register('availability')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 24/7, Mon-Fri 9am-6pm, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Types (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Full Body Massage', 'Therapeutic Massage', 'Oil Massage', 'Swedish Massage', 'Deep Tissue Massage', 'Aromatherapy', 'Hot Stone Massage', 'Sports Massage'].map((service) => (
                  <label key={service} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={service}
                      {...register('serviceTypes')}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
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
        {step === 5 && !createdAd && (
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
              {watch('age') && (
                <div>
                  <h3 className="font-semibold text-gray-700">Age</h3>
                  <p className="text-gray-900">{watch('age')} Years</p>
                </div>
              )}
              {watch('price') && (
                <div>
                  <h3 className="font-semibold text-gray-700">Price (General)</h3>
                  <p className="text-gray-900">₹{parseFloat(watch('price') || '0').toLocaleString()}</p>
                </div>
              )}
              {(watch('priceOneHour') || watch('priceTwoHour') || watch('priceThreeHour') || watch('priceFullNight')) && (
                <div>
                  <h3 className="font-semibold text-gray-700">Pricing Tiers</h3>
                  <div className="space-y-1">
                    {watch('priceOneHour') && (
                      <p className="text-gray-900">1 Hour: ₹{parseFloat(watch('priceOneHour') || '0').toLocaleString()}</p>
                    )}
                    {watch('priceTwoHour') && (
                      <p className="text-gray-900">2 Hours: ₹{parseFloat(watch('priceTwoHour') || '0').toLocaleString()}</p>
                    )}
                    {watch('priceThreeHour') && (
                      <p className="text-gray-900">3 Hours: ₹{parseFloat(watch('priceThreeHour') || '0').toLocaleString()}</p>
                    )}
                    {watch('priceFullNight') && (
                      <p className="text-gray-900">Full Night: ₹{parseFloat(watch('priceFullNight') || '0').toLocaleString()}</p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-700">Category</h3>
                <p className="text-gray-900">
                  {categories.find((c: Category) => c.id.toString() === selectedCategory)?.name || 'Not selected'}
                </p>
              </div>
              {watch('serviceLocations') && (
                <div>
                  <h3 className="font-semibold text-gray-700">Service Locations</h3>
                  <p className="text-gray-900">
                    {watch('serviceLocations') === 'home' ? 'Home Only' : watch('serviceLocations') === 'hotel' ? 'Hotel Only' : 'Both (Home & Hotel)'}
                  </p>
                </div>
              )}
              {watch('availability') && (
                <div>
                  <h3 className="font-semibold text-gray-700">Availability</h3>
                  <p className="text-gray-900">{watch('availability')}</p>
                </div>
              )}
              {watch('serviceTypes') && Array.isArray(watch('serviceTypes')) && watch('serviceTypes')!.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700">Service Types</h3>
                  <p className="text-gray-900">{watch('serviceTypes')!.join(', ')}</p>
                </div>
              )}
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

        {/* Step 6: Plan Selection */}
        {step === 6 && createdAd && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Select a Subscription Plan</h2>
            <p className="text-gray-600 mb-6">
              Your advertisement has been saved as a draft. Please select a subscription plan to publish it.
            </p>
            <PlanSelector
              onSelectPlan={handlePlanSelect}
              selectedPlanId={selectedPlan?.id}
            />
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Save for Later
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 6 && (
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
        )}
      </form>

      {/* Payment Request Modal */}
      {showPaymentModal && selectedPlan && createdAd && (
        <PaymentRequestModal
          plan={selectedPlan}
          advertisement={createdAd}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PostAd;
