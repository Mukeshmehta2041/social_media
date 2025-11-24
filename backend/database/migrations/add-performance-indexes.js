/**
 * Migration to add performance indexes
 * Run this migration manually or via Strapi migration system
 * 
 * Note: Strapi uses link tables for many-to-one relations, so foreign key indexes
 * are created on the link tables, not the main table.
 */

module.exports = {
  async up(knex) {
    // Add indexes for advertisements table (direct columns)
    await knex.schema.alterTable('advertisements', (table) => {
      // Index on status for filtering approved ads
      table.index('status', 'idx_ads_status');
      
      // Index on created_at for sorting
      table.index('created_at', 'idx_ads_created');
      
      // Index on published_at for filtering published ads
      table.index('published_at', 'idx_ads_published');
      
      // Composite index for common query pattern: status + published_at
      table.index(['status', 'published_at'], 'idx_ads_status_published');
    });

    // Add indexes for link tables (foreign keys are stored here in Strapi)
    // Check if link tables exist before creating indexes
    const hasCityLinkTable = await knex.schema.hasTable('advertisements_city_lnk');
    const hasCategoryLinkTable = await knex.schema.hasTable('advertisements_category_lnk');

    if (hasCityLinkTable) {
      await knex.schema.alterTable('advertisements_city_lnk', (table) => {
        // Index on city_id for filtering by city
        table.index('city_id', 'idx_ads_city_lnk_city');
        // Index on advertisement_id for reverse lookups
        table.index('advertisement_id', 'idx_ads_city_lnk_ad');
      });
    }

    if (hasCategoryLinkTable) {
      await knex.schema.alterTable('advertisements_category_lnk', (table) => {
        // Index on category_id for filtering by category
        table.index('category_id', 'idx_ads_category_lnk_category');
        // Index on advertisement_id for reverse lookups
        table.index('advertisement_id', 'idx_ads_category_lnk_ad');
      });
    }

    // Add indexes for categories table
    const hasCategoriesTable = await knex.schema.hasTable('categories');
    if (hasCategoriesTable) {
      await knex.schema.alterTable('categories', (table) => {
        // Index on slug for lookups
        table.index('slug', 'idx_categories_slug');
      });
    }

    // Add indexes for cities table
    const hasCitiesTable = await knex.schema.hasTable('cities');
    if (hasCitiesTable) {
      await knex.schema.alterTable('cities', (table) => {
        // Index on slug for lookups
        table.index('slug', 'idx_cities_slug');
      });
    }
  },

  async down(knex) {
    // Remove indexes from advertisements table
    await knex.schema.alterTable('advertisements', (table) => {
      table.dropIndex('status', 'idx_ads_status');
      table.dropIndex('created_at', 'idx_ads_created');
      table.dropIndex('published_at', 'idx_ads_published');
      table.dropIndex(['status', 'published_at'], 'idx_ads_status_published');
    });

    // Remove indexes from link tables
    const hasCityLinkTable = await knex.schema.hasTable('advertisements_city_lnk');
    const hasCategoryLinkTable = await knex.schema.hasTable('advertisements_category_lnk');

    if (hasCityLinkTable) {
      await knex.schema.alterTable('advertisements_city_lnk', (table) => {
        table.dropIndex('city_id', 'idx_ads_city_lnk_city');
        table.dropIndex('advertisement_id', 'idx_ads_city_lnk_ad');
      });
    }

    if (hasCategoryLinkTable) {
      await knex.schema.alterTable('advertisements_category_lnk', (table) => {
        table.dropIndex('category_id', 'idx_ads_category_lnk_category');
        table.dropIndex('advertisement_id', 'idx_ads_category_lnk_ad');
      });
    }

    // Remove indexes from categories and cities
    const hasCategoriesTable = await knex.schema.hasTable('categories');
    if (hasCategoriesTable) {
      await knex.schema.alterTable('categories', (table) => {
        table.dropIndex('slug', 'idx_categories_slug');
      });
    }

    const hasCitiesTable = await knex.schema.hasTable('cities');
    if (hasCitiesTable) {
      await knex.schema.alterTable('cities', (table) => {
        table.dropIndex('slug', 'idx_cities_slug');
      });
    }
  },
};

