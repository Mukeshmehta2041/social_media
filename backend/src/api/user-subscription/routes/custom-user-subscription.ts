export default {
  routes: [
    {
      method: 'GET',
      path: '/user-subscriptions/check-limit',
      handler: 'api::user-subscription.user-subscription.checkLimit',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

