import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::subscription-plan.subscription-plan', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    // Only show active plans for public users
    const filters: any = {};
    if (!ctx.state.user || ctx.state.user.role.type !== 'admin') {
      filters.isActive = true;
    }

    const { results, pagination } = await strapi
      .service('api::subscription-plan.subscription-plan')
      .find({
        ...query,
        filters,
        populate: ['paymentRequests', 'userSubscriptions'],
        sort: { sortOrder: 'asc' },
      });

    return { data: results, meta: { pagination } };
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const filters: any = {
      id: parseInt(id) || id,
    };

    // Only show active plans for public users
    if (!ctx.state.user || ctx.state.user.role.type !== 'admin') {
      filters.isActive = true;
    }

    const entity = await strapi
      .query('api::subscription-plan.subscription-plan')
      .findOne({
        where: filters,
        populate: ['paymentRequests', 'userSubscriptions'],
      });

    if (!entity) {
      return ctx.notFound();
    }

    return { data: entity };
  },
}));

