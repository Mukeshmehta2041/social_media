import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Set up permissions for Public role
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' }, populate: ['permissions'] });

      if (publicRole) {
        // Get all permissions for this role
        const allPermissions = await strapi
          .query('plugin::users-permissions.permission')
          .findMany({ where: { role: publicRole.id } });

        // Define permissions to enable for Public role
        const publicPermissionActions = [
          'api::advertisement.advertisement.find',
          'api::advertisement.advertisement.findOne',
          'api::advertisement.advertisement.incrementView',
          'api::advertisement.advertisement.getByCity',
          'api::advertisement.advertisement.getByCategory',
          'api::category.category.find',
          'api::category.category.findOne',
          'api::city.city.find',
          'api::city.city.findOne',
          'api::contact-form.contact-form.create',
        ];

        // Enable permissions
        for (const action of publicPermissionActions) {
          let permission = allPermissions.find((p) => p.action === action);

          if (!permission) {
            // Create permission if it doesn't exist
            permission = await strapi
              .query('plugin::users-permissions.permission')
              .create({
                data: {
                  action,
                  role: publicRole.id,
                },
              });
          } else if (!permission.enabled) {
            // Enable existing permission
            await strapi
              .query('plugin::users-permissions.permission')
              .update({
                where: { id: permission.id },
                data: { enabled: true },
              });
          }
        }

        strapi.log.info('✅ Public role permissions configured successfully');
      }

      // Set up permissions for Authenticated role
      const authenticatedRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'authenticated' }, populate: ['permissions'] });

      if (authenticatedRole) {
        const allAuthPermissions = await strapi
          .query('plugin::users-permissions.permission')
          .findMany({ where: { role: authenticatedRole.id } });

        const authenticatedPermissionActions = [
          // Advertisement permissions
          'api::advertisement.advertisement.find',
          'api::advertisement.advertisement.findOne',
          'api::advertisement.advertisement.create',
          'api::advertisement.advertisement.update',
          'api::advertisement.advertisement.delete',
          'api::advertisement.advertisement.incrementView',
          'api::advertisement.advertisement.requestPromotion',
          'api::advertisement.advertisement.getByCity',
          'api::advertisement.advertisement.getByCategory',
          // Category permissions
          'api::category.category.find',
          'api::category.category.findOne',
          // City permissions
          'api::city.city.find',
          'api::city.city.findOne',
          // Report permissions
          'api::report.report.create',
          'api::report.report.find',
          'api::report.report.findOne',
          // Saved Search permissions
          'api::saved-search.saved-search.find',
          'api::saved-search.saved-search.findOne',
          'api::saved-search.saved-search.create',
          'api::saved-search.saved-search.update',
          'api::saved-search.saved-search.delete',
          // Contact Form permissions
          'api::contact-form.contact-form.create',
        ];

        for (const action of authenticatedPermissionActions) {
          let permission = allAuthPermissions.find((p) => p.action === action);

          if (!permission) {
            permission = await strapi
              .query('plugin::users-permissions.permission')
              .create({
                data: {
                  action,
                  role: authenticatedRole.id,
                },
              });
          } else if (!permission.enabled) {
            await strapi
              .query('plugin::users-permissions.permission')
              .update({
                where: { id: permission.id },
                data: { enabled: true },
              });
          }
        }

        strapi.log.info('✅ Authenticated role permissions configured successfully');
      }
    } catch (error: any) {
      strapi.log.error('❌ Error setting up permissions:', error);
      strapi.log.error('Error details:', error?.message || 'Unknown error');
    }
  },
};
