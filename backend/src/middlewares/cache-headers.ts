/**
 * Middleware to add cache headers for static data endpoints
 * Cities and categories rarely change, so we can cache them
 */

export default (config: any, { strapi }: any) => {
  return async (ctx: any, next: any) => {
    await next();

    // Add cache headers for static data endpoints
    const path = ctx.request.url;
    
    // Cache cities and categories for 1 hour (they rarely change)
    if (path.includes('/api/cities') || path.includes('/api/categories')) {
      ctx.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      ctx.set('ETag', `"${Date.now()}"`); // Simple ETag based on timestamp
    }
    
    // Cache advertisement lists for shorter time (5 minutes)
    if (path.includes('/api/advertisements') && ctx.request.method === 'GET') {
      // Only cache list endpoints, not individual ad endpoints
      if (!path.match(/\/api\/advertisements\/\d+$/)) {
        ctx.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      }
    }
  };
};

