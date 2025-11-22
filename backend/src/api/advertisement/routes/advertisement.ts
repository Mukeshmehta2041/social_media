/**
 * advertisement router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::advertisement.advertisement', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
    create: {
      middlewares: [],
    },
    update: {
      middlewares: [],
    },
    delete: {
      middlewares: [],
    },
  },
});

