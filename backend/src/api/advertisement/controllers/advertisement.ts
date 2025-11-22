/**
 * advertisement controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::advertisement.advertisement', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    // Extract filters from query
    const filters: any = {};

    if (query.category) {
      filters.category = { slug: query.category };
    }

    if (query.city) {
      filters.city = { slug: query.city };
    }

    if (query.minPrice || query.maxPrice) {
      filters.price = {};
      if (query.minPrice) {
        filters.price.$gte = parseFloat(String(query.minPrice));
      }
      if (query.maxPrice) {
        filters.price.$lte = parseFloat(String(query.maxPrice));
      }
    }

    if (query.search) {
      filters.$or = [
        { title: { $containsi: query.search } },
        { description: { $containsi: query.search } },
      ];
    }

    // Only show approved ads for public
    if (!ctx.state.user || ctx.state.user.role.type !== 'admin') {
      filters.status = 'approved';
      filters.publishedAt = { $notNull: true };
    }

    const { results, pagination } = await strapi
      .service('api::advertisement.advertisement')
      .find({
        ...ctx.query,
        filters,
        populate: ['category', 'city', 'user', 'images'],
      });

    return { data: results, meta: { pagination } };
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    // Build where clause
    const where: any = {
      id: parseInt(id) || id, // Try numeric ID first, fallback to string
    };

    // Only show approved and published ads for public users
    const isAdmin = ctx.state.user && ctx.state.user.role?.type === 'admin';
    if (!isAdmin) {
      where.status = 'approved';
      where.publishedAt = { $notNull: true };
    }

    // Use query builder to find the entity with filters
    const entity = await strapi
      .query('api::advertisement.advertisement')
      .findOne({
        where,
        populate: ['category', 'city', 'user', 'images'],
      });

    // If entity not found, return not found
    if (!entity) {
      return ctx.notFound();
    }

    // Increment view count
    await strapi
      .service('api::advertisement.advertisement')
      .update(id, {
        data: { viewCount: (entity.viewCount || 0) + 1 },
      });

    // Fetch updated entity with new view count
    const updatedEntity = await strapi
      .query('api::advertisement.advertisement')
      .findOne({
        where: {
          id: parseInt(id) || id,
        },
        populate: ['category', 'city', 'user', 'images'],
      });

    return { data: updatedEntity };
  },

  async incrementView(ctx) {
    const { id } = ctx.params;

    const entity = await strapi
      .service('api::advertisement.advertisement')
      .findOne(id);

    if (entity) {
      const updated = await strapi
        .service('api::advertisement.advertisement')
        .update(id, {
          data: { viewCount: (entity.viewCount || 0) + 1 },
        });

      return { data: updated };
    }

    return ctx.notFound();
  },

  async requestPromotion(ctx) {
    const { id } = ctx.params;
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '+1234567890';

    const entity = await strapi
      .service('api::advertisement.advertisement')
      .findOne(id, {
        populate: ['category', 'city'],
      });

    if (!entity) {
      return ctx.notFound();
    }

    const message = `I want to promote my ad: ${entity.title} (ID: ${id})`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

    return { data: { whatsappUrl, message } };
  },

  async getByCity(ctx) {
    const { citySlug } = ctx.params;
    const { query } = ctx;

    const filters: any = {
      city: { slug: citySlug },
      status: 'approved',
      publishedAt: { $notNull: true },
    };

    if (query.category) {
      filters.category = { slug: query.category };
    }

    const { results, pagination } = await strapi
      .service('api::advertisement.advertisement')
      .find({
        ...query,
        filters,
        populate: ['category', 'city', 'user', 'images'],
      });

    return { data: results, meta: { pagination } };
  },

  async getByCategory(ctx) {
    const { categorySlug } = ctx.params;
    const { query } = ctx;

    const filters: any = {
      category: { slug: categorySlug },
      status: 'approved',
      publishedAt: { $notNull: true },
    };

    if (query.city) {
      filters.city = { slug: query.city };
    }

    const { results, pagination } = await strapi
      .service('api::advertisement.advertisement')
      .find({
        ...query,
        filters,
        populate: ['category', 'city', 'user', 'images'],
      });

    return { data: results, meta: { pagination } };
  },

  async getRelated(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    const limit = parseInt(String(query.limit || '6'));

    // Get the current ad
    const currentAd: any = await strapi.entityService.findOne('api::advertisement.advertisement', id, {
      populate: ['category', 'city'],
    });

    if (!currentAd) {
      return ctx.notFound('Advertisement not found');
    }

    const filters: any = {
      id: { $ne: id },
      status: 'approved',
      publishedAt: { $notNull: true },
    };

    // Filter by category or city if available
    if (currentAd.category && typeof currentAd.category === 'object' && 'id' in currentAd.category) {
      filters.category = { id: currentAd.category.id };
    }
    if (currentAd.city && typeof currentAd.city === 'object' && 'id' in currentAd.city) {
      filters.city = { id: currentAd.city.id };
    }

    const { results } = await strapi
      .service('api::advertisement.advertisement')
      .find({
        filters,
        populate: ['category', 'city', 'images'],
        pagination: { limit },
        sort: { createdAt: 'desc' },
      });

    return { data: results };
  },
}));

