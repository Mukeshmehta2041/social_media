export default {
  routes: [
    {
      method: 'POST',
      path: '/payment-requests/:id/verify',
      handler: 'api::payment-request.payment-request.verifyPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment-requests/:id/cancel',
      handler: 'api::payment-request.payment-request.cancel',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

