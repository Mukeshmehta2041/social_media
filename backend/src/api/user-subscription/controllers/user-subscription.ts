import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::user-subscription.user-subscription', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to view subscriptions');
    }

    const filters: any = {};

    // Non-admin users can only see their own subscriptions
    if (!user.role || user.role.type !== 'admin') {
      filters.user = { id: user.id };
    }

    // Filter by active status if provided
    if (ctx.query.isActive !== undefined) {
      filters.isActive = ctx.query.isActive === 'true';
    }

    const { results, pagination } = await strapi
      .service('api::user-subscription.user-subscription')
      .find({
        ...ctx.query,
        filters,
        populate: ['user', 'subscriptionPlan'],
        sort: { createdAt: 'desc' },
      });

    return { data: results, meta: { pagination } };
  },

  async checkLimit(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to check subscription limits');
    }

    // Get active subscription for user
    const subscription = await strapi
      .query('api::user-subscription.user-subscription')
      .findOne({
        where: {
          user: { id: user.id },
          isActive: true,
        },
        populate: ['subscriptionPlan'],
      });

    if (!subscription) {
      return {
        data: {
          hasActiveSubscription: false,
          canPost: false,
          postsUsed: 0,
          postsLimit: 0,
          postsRemaining: 0,
        },
      };
    }

    // Check if subscription is still valid
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const isExpired = now > endDate;

    if (isExpired) {
      // Deactivate expired subscription
      await strapi
        .service('api::user-subscription.user-subscription')
        .update(subscription.id, {
          data: { isActive: false },
        });

      return {
        data: {
          hasActiveSubscription: false,
          canPost: false,
          postsUsed: subscription.postsUsed,
          postsLimit: subscription.postsLimit,
          postsRemaining: 0,
        },
      };
    }

    const postsRemaining = subscription.postsLimit - subscription.postsUsed;
    const canPost = postsRemaining > 0;

    return {
      data: {
        hasActiveSubscription: true,
        canPost,
        postsUsed: subscription.postsUsed,
        postsLimit: subscription.postsLimit,
        postsRemaining,
        subscription: {
          id: subscription.id,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          plan: subscription.subscriptionPlan,
        },
      },
    };
  },
}));

