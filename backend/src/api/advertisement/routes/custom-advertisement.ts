export default {
  routes: [
    {
      method: 'POST',
      path: '/advertisements/:id/increment-view',
      handler: 'api::advertisement.advertisement.incrementView',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/advertisements/:id/promote',
      handler: 'api::advertisement.advertisement.requestPromotion',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/advertisements/city/:citySlug',
      handler: 'api::advertisement.advertisement.getByCity',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/advertisements/category/:categorySlug',
      handler: 'api::advertisement.advertisement.getByCategory',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/advertisements/:id/related',
      handler: 'api::advertisement.advertisement.getRelated',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
