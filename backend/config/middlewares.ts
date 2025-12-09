export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost', 'http://localhost:80'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  // Compression middleware for better performance
  {
    name: 'strapi::compression',
    config: {
      enabled: true,
      threshold: 1024, // Only compress responses larger than 1KB
    },
  },
  // Custom cache headers middleware
  {
    resolve: './src/middlewares/cache-headers',
    config: {},
  },
];
