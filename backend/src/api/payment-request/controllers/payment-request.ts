import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::payment-request.payment-request', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to create a payment request');
    }

    // Ensure user is creating payment request for themselves
    const paymentData = {
      ...data,
      user: user.id,
    };

    const entity = await strapi
      .service('api::payment-request.payment-request')
      .create({
        data: paymentData,
        populate: ['user', 'advertisement', 'subscriptionPlan'],
      });

    return { data: entity };
  },

  async find(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to view payment requests');
    }

    const filters: any = {};

    // Non-admin users can only see their own payment requests
    if (!user.role || user.role.type !== 'admin') {
      filters.user = { id: user.id };
    }

    // Admin can filter by status
    if (ctx.query.status) {
      filters.status = ctx.query.status;
    }

    const { results, pagination } = await strapi
      .service('api::payment-request.payment-request')
      .find({
        ...ctx.query,
        filters,
        populate: ['user', 'advertisement', 'subscriptionPlan', 'verifiedBy'],
        sort: { createdAt: 'desc' },
      });

    return { data: results, meta: { pagination } };
  },

  async verifyPayment(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const adminUser = ctx.state.user;

    if (!adminUser || !adminUser.role || adminUser.role.type !== 'admin') {
      return ctx.forbidden('Only admins can verify payments');
    }

    // Get the payment request
    const paymentRequest = await strapi
      .query('api::payment-request.payment-request')
      .findOne({
        where: { id: parseInt(id) || id },
        populate: ['user', 'advertisement', 'subscriptionPlan'],
      });

    if (!paymentRequest) {
      return ctx.notFound('Payment request not found');
    }

    if (paymentRequest.status !== 'pending') {
      return ctx.badRequest('Payment request is not in pending status');
    }

    // Update payment request status
    const updatedPaymentRequest = await strapi
      .service('api::payment-request.payment-request')
      .update(id, {
        data: {
          status: 'paid',
          paidAt: new Date(),
          verifiedBy: adminUser.id,
          transactionId: data.transactionId || paymentRequest.transactionId,
          paymentMethod: data.paymentMethod || paymentRequest.paymentMethod,
          adminNotes: data.adminNotes || paymentRequest.adminNotes,
        },
        populate: ['user', 'advertisement', 'subscriptionPlan', 'verifiedBy'],
      });

    // Create or update user subscription
    const subscriptionPlan = paymentRequest.subscriptionPlan;
    let userSubscription = null;

    if (subscriptionPlan) {
      // Check if user has an active subscription
      const existingSubscription = await strapi
        .query('api::user-subscription.user-subscription')
        .findOne({
          where: {
            user: { id: paymentRequest.user.id },
            isActive: true,
          },
          populate: ['subscriptionPlan'],
        });

      const now = new Date();
      let startDate = now;
      let endDate = new Date();

      // Calculate end date based on duration
      if (subscriptionPlan.duration === 'weekly') {
        endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else if (subscriptionPlan.duration === 'monthly') {
        endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else if (subscriptionPlan.duration === 'yearly') {
        endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      }

      if (existingSubscription) {
        // Extend existing subscription
        userSubscription = await strapi
          .service('api::user-subscription.user-subscription')
          .update(existingSubscription.id, {
            data: {
              subscriptionPlan: subscriptionPlan.id,
              postsLimit: subscriptionPlan.postLimit,
              endDate: endDate,
              renewedAt: now,
            },
          });
      } else {
        // Create new subscription
        userSubscription = await strapi
          .service('api::user-subscription.user-subscription')
          .create({
            data: {
              user: paymentRequest.user.id,
              subscriptionPlan: subscriptionPlan.id,
              postsUsed: 0,
              postsLimit: subscriptionPlan.postLimit,
              startDate: startDate,
              endDate: endDate,
              isActive: true,
            },
          });
      }
    }

    // Approve the linked advertisement if it exists
    if (paymentRequest.advertisement) {
      await strapi
        .service('api::advertisement.advertisement')
        .update(paymentRequest.advertisement.id, {
          data: {
            status: 'approved',
            subscriptionPlan: subscriptionPlan?.id,
            publishedAt: new Date(),
          },
        });

      // Increment postsUsed in user subscription
      if (userSubscription) {
        await strapi
          .service('api::user-subscription.user-subscription')
          .update(userSubscription.id, {
            data: {
              postsUsed: (userSubscription.postsUsed || 0) + 1,
            },
          });
      }
    }

    return { data: updatedPaymentRequest };
  },

  async cancel(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be authenticated to cancel a payment request');
    }

    const paymentRequest = await strapi
      .query('api::payment-request.payment-request')
      .findOne({
        where: { id: parseInt(id) || id },
        populate: ['user'],
      });

    if (!paymentRequest) {
      return ctx.notFound('Payment request not found');
    }

    // Only allow user to cancel their own payment request or admin
    const isAdmin = user.role && user.role.type === 'admin';
    const isOwner = paymentRequest.user.id === user.id;

    if (!isAdmin && !isOwner) {
      return ctx.forbidden('You can only cancel your own payment requests');
    }

    if (paymentRequest.status !== 'pending') {
      return ctx.badRequest('Only pending payment requests can be cancelled');
    }

    const updatedPaymentRequest = await strapi
      .service('api::payment-request.payment-request')
      .update(id, {
        data: {
          status: 'cancelled',
        },
      });

    return { data: updatedPaymentRequest };
  },
}));

