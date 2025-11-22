/**
 * Database Seeding Script
 * Seeds initial data: Categories, Cities, Test User, Advertisements
 */

import type { Core } from '@strapi/strapi';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

const categories = [
  { name: 'General Services', description: 'General services and assistance', icon: 'briefcase', sortOrder: 1 },
  { name: 'Professional Services', description: 'Professional and business services', icon: 'user-tie', sortOrder: 2 },
  { name: 'Personal Services', description: 'Personal care and services', icon: 'user', sortOrder: 3 },
  { name: 'Entertainment', description: 'Entertainment and events', icon: 'music', sortOrder: 4 },
  { name: 'Health & Wellness', description: 'Health, fitness, and wellness services', icon: 'heart', sortOrder: 5 },
  { name: 'Education', description: 'Tutoring and educational services', icon: 'graduation-cap', sortOrder: 6 },
  { name: 'Home Services', description: 'Home maintenance and repair', icon: 'home', sortOrder: 7 },
  { name: 'Automotive', description: 'Car services and automotive', icon: 'car', sortOrder: 8 },
  { name: 'Beauty & Spa', description: 'Beauty treatments and spa services', icon: 'spa', sortOrder: 9 },
  { name: 'Photography', description: 'Photography and videography services', icon: 'camera', sortOrder: 10 },
];

const cities = [
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Delhi', state: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
  { name: 'Bangalore', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867 },
  { name: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Kolkata', state: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Pune', state: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714 },
  { name: 'Jaipur', state: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873 },
  { name: 'Surat', state: 'Gujarat', country: 'India', latitude: 21.1702, longitude: 72.8311 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462 },
  { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', latitude: 26.4499, longitude: 80.3319 },
  { name: 'Nagpur', state: 'Maharashtra', country: 'India', latitude: 21.1458, longitude: 79.0882 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', latitude: 22.7196, longitude: 75.8577 },
  { name: 'Thane', state: 'Maharashtra', country: 'India', latitude: 19.2183, longitude: 72.9781 },
  { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', latitude: 23.2599, longitude: 77.4126 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', latitude: 17.6868, longitude: 83.2185 },
  { name: 'Patna', state: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376 },
  { name: 'Vadodara', state: 'Gujarat', country: 'India', latitude: 22.3072, longitude: 73.1812 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', latitude: 28.6692, longitude: 77.4538 },
  { name: 'Ludhiana', state: 'Punjab', country: 'India', latitude: 30.9010, longitude: 75.8573 },
  { name: 'Agra', state: 'Uttar Pradesh', country: 'India', latitude: 27.1767, longitude: 78.0081 },
  { name: 'Nashik', state: 'Maharashtra', country: 'India', latitude: 19.9975, longitude: 73.7898 },
  { name: 'Faridabad', state: 'Haryana', country: 'India', latitude: 28.4089, longitude: 77.3178 },
  { name: 'Meerut', state: 'Uttar Pradesh', country: 'India', latitude: 28.9845, longitude: 77.7064 },
];

// Sample advertisements data
const sampleAdvertisements = [
  {
    title: 'Professional Photography Services',
    description: '<p>Experienced photographer offering wedding, event, and portrait photography services. High-quality images delivered on time. Available for bookings throughout the city.</p>',
    price: 5000,
    categoryName: 'Photography',
    cityName: 'Mumbai',
    contactPhone: '+91-9876543210',
    contactEmail: 'photographer@example.com',
    whatsappNumber: '+91-9876543210',
    isPremium: true,
    status: 'approved' as const,
  },
  {
    title: 'Home Cleaning Services',
    description: '<p>Professional home cleaning services available. Deep cleaning, regular maintenance, and move-in/move-out cleaning. Trained staff, eco-friendly products.</p>',
    price: 1500,
    categoryName: 'Home Services',
    cityName: 'Delhi',
    contactPhone: '+91-9876543211',
    contactEmail: 'cleaning@example.com',
    whatsappNumber: '+91-9876543211',
    isPremium: false,
    status: 'approved' as const,
  },
  {
    title: 'Yoga and Meditation Classes',
    description: '<p>Join our yoga and meditation classes for physical and mental wellness. Experienced instructors, flexible timings. Group and individual sessions available.</p>',
    price: 2000,
    categoryName: 'Health & Wellness',
    cityName: 'Bangalore',
    contactPhone: '+91-9876543212',
    contactEmail: 'yoga@example.com',
    whatsappNumber: '+91-9876543212',
    isPremium: false,
    status: 'approved' as const,
  },
  {
    title: 'Car Repair and Maintenance',
    description: '<p>Expert car repair and maintenance services. All makes and models. Quick service, genuine parts, affordable rates. Free pickup and drop available.</p>',
    price: 3000,
    categoryName: 'Automotive',
    cityName: 'Hyderabad',
    contactPhone: '+91-9876543213',
    contactEmail: 'carrepair@example.com',
    whatsappNumber: '+91-9876543213',
    isPremium: true,
    status: 'approved' as const,
  },
  {
    title: 'Beauty Salon Services',
    description: '<p>Full-service beauty salon offering haircuts, styling, facials, manicure, pedicure, and spa treatments. Professional staff, premium products.</p>',
    price: 2500,
    categoryName: 'Beauty & Spa',
    cityName: 'Chennai',
    contactPhone: '+91-9876543214',
    contactEmail: 'beauty@example.com',
    whatsappNumber: '+91-9876543214',
    isPremium: false,
    status: 'approved' as const,
  },
  {
    title: 'Math and Science Tutoring',
    description: '<p>Experienced tutor offering math and science classes for students. CBSE, ICSE, and state board curriculum. Online and offline classes available.</p>',
    price: 2000,
    categoryName: 'Education',
    cityName: 'Pune',
    contactPhone: '+91-9876543215',
    contactEmail: 'tutor@example.com',
    whatsappNumber: '+91-9876543215',
    isPremium: false,
    status: 'approved',
  },
  {
    title: 'Event Planning Services',
    description: '<p>Complete event planning services for weddings, birthdays, corporate events. From concept to execution, we handle everything. Stress-free celebrations guaranteed.</p>',
    price: 50000,
    categoryName: 'Entertainment',
    cityName: 'Kolkata',
    contactPhone: '+91-9876543216',
    contactEmail: 'events@example.com',
    whatsappNumber: '+91-9876543216',
    isPremium: true,
    status: 'approved' as const,
  },
  {
    title: 'Legal Consultation Services',
    description: '<p>Experienced lawyer offering legal consultation for property, business, family law matters. Expert advice, affordable rates, confidential service.</p>',
    price: 3000,
    categoryName: 'Professional Services',
    cityName: 'Ahmedabad',
    contactPhone: '+91-9876543217',
    contactEmail: 'legal@example.com',
    whatsappNumber: '+91-9876543217',
    isPremium: false,
    status: 'approved' as const,
  },
  {
    title: 'Personal Fitness Trainer',
    description: '<p>Certified personal trainer offering customized fitness programs. Weight loss, muscle gain, strength training. Home visits and gym sessions available.</p>',
    price: 4000,
    categoryName: 'Health & Wellness',
    cityName: 'Jaipur',
    contactPhone: '+91-9876543218',
    contactEmail: 'fitness@example.com',
    whatsappNumber: '+91-9876543218',
    isPremium: false,
    status: 'approved',
  },
  {
    title: 'Plumbing and Electrical Services',
    description: '<p>24/7 plumbing and electrical services. Expert technicians, quick response, quality workmanship. All types of repairs and installations.</p>',
    price: 2000,
    categoryName: 'Home Services',
    cityName: 'Surat',
    contactPhone: '+91-9876543219',
    contactEmail: 'plumber@example.com',
    whatsappNumber: '+91-9876543219',
    isPremium: false,
    status: 'approved' as const,
  },
];

export async function seedDatabase(strapi: Core.Strapi) {
  try {
    strapi.log.info('🌱 Starting database seeding...');

    // Seed Categories
    const existingCategories = await strapi
      .query('api::category.category')
      .findMany({ limit: 1 });

    if (existingCategories.length === 0) {
      strapi.log.info('📁 Seeding categories...');
      for (const categoryData of categories) {
        await strapi.entityService.create('api::category.category', {
          data: {
            ...categoryData,
            slug: generateSlug(categoryData.name),
            isActive: true,
            publishedAt: new Date(),
          },
        });
      }
      strapi.log.info(`✅ Created ${categories.length} categories`);
    } else {
      strapi.log.info('ℹ️  Categories already exist, skipping...');
    }

    // Seed Cities
    const existingCities = await strapi
      .query('api::city.city')
      .findMany({ limit: 1 });

    if (existingCities.length === 0) {
      strapi.log.info('🏙️  Seeding cities...');
      for (const cityData of cities) {
        await strapi.entityService.create('api::city.city', {
          data: {
            ...cityData,
            slug: generateSlug(cityData.name),
            isActive: true,
            publishedAt: new Date(),
          },
        });
      }
      strapi.log.info(`✅ Created ${cities.length} cities`);
    } else {
      strapi.log.info('ℹ️  Cities already exist, skipping...');
    }

    // Create or get test user for advertisements
    let testUser = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { email: 'testuser@example.com' } });

    if (!testUser) {
      strapi.log.info('👤 Creating test user...');
      const authenticatedRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' } });

      if (authenticatedRole) {
        testUser = await strapi
          .query('plugin::users-permissions.user')
          .create({
            data: {
              username: 'testuser',
              email: 'testuser@example.com',
              password: 'Test@123456', // You should change this in production
              confirmed: true,
              blocked: false,
              role: authenticatedRole.id,
            },
          });
        strapi.log.info('✅ Created test user (testuser@example.com / Test@123456)');
      }
    } else {
      strapi.log.info('ℹ️  Test user already exists, skipping...');
    }

    // Seed Advertisements
    const existingAds = await strapi
      .query('api::advertisement.advertisement')
      .findMany({ limit: 1 });

    if (existingAds.length === 0 && testUser) {
      strapi.log.info('📢 Seeding advertisements...');

      // Get all categories and cities for mapping
      const allCategories = await strapi
        .query('api::category.category')
        .findMany();
      const allCities = await strapi
        .query('api::city.city')
        .findMany();

      const categoryMap = new Map(allCategories.map(cat => [cat.name, cat.id]));
      const cityMap = new Map(allCities.map(city => [city.name, city.id]));

      let createdCount = 0;
      for (const adData of sampleAdvertisements) {
        const categoryId = categoryMap.get(adData.categoryName);
        const cityId = cityMap.get(adData.cityName);

        if (categoryId && cityId) {
          // Set expiration date to 90 days from now
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 90);

          await strapi.entityService.create('api::advertisement.advertisement', {
            data: {
              title: adData.title,
              slug: generateSlug(adData.title),
              description: adData.description,
              price: adData.price,
              category: categoryId,
              city: cityId,
              user: testUser.id,
              contactPhone: adData.contactPhone,
              contactEmail: adData.contactEmail,
              whatsappNumber: adData.whatsappNumber,
              isPremium: adData.isPremium,
              status: adData.status as 'approved' | 'draft' | 'pending' | 'rejected' | 'expired',
              viewCount: Math.floor(Math.random() * 100), // Random view count for demo
              expiresAt: expiresAt,
              publishedAt: new Date(),
            },
          });
          createdCount++;
        } else {
          strapi.log.warn(`⚠️  Skipping ad "${adData.title}" - category or city not found`);
        }
      }
      strapi.log.info(`✅ Created ${createdCount} advertisements`);
    } else if (existingAds.length > 0) {
      strapi.log.info('ℹ️  Advertisements already exist, skipping...');
    } else {
      strapi.log.warn('⚠️  Cannot create advertisements - test user not found');
    }

    strapi.log.info('✨ Database seeding completed!');
  } catch (error: any) {
    strapi.log.error('❌ Error seeding database:', error);
    strapi.log.error('Error details:', error?.message || 'Unknown error');
    if (error.stack) {
      strapi.log.error('Stack trace:', error.stack);
    }
  }
}

