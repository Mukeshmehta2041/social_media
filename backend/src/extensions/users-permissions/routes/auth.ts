/**
 * Custom auth routes for password reset
 * Note: Handler format may need adjustment based on Strapi version
 * If routes don't work, try: 'plugin::users-permissions.auth.forgotPassword'
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/forgot-password',
      handler: 'auth.forgotPassword',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/auth/reset-password',
      handler: 'auth.resetPassword',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

