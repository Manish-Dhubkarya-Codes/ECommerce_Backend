'use strict';

const { query } = require('../config/database');
const { ok } = require('../utils/apiResponse');

async function getHome(req, res, next) {
  try {
    const [
      newArrivals,
      featured,
      rail,
      categories,
      featuredCollection,
      stats,
    ] = await Promise.all([
      query(`
        SELECT p.id, p.slug, p.name, p.subtitle, p.price, p.compare_at_price, p.currency,
               p.gender, p.color_name, p.color_hex, p.images, p.sizes, p.is_new,
               p.is_featured, p.stock, c.name AS category_name, c.slug AS category_slug
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.is_new = TRUE OR p.is_featured = TRUE
        ORDER BY p.is_new DESC, p.sort_order ASC
        LIMIT 8`),
      query(`
        SELECT p.id, p.slug, p.name, p.subtitle, p.price, p.currency,
               p.images, p.color_name, p.is_featured, p.stock
        FROM products p
        WHERE p.is_featured = TRUE
        ORDER BY p.sort_order ASC
        LIMIT 4`),
      query(`
        SELECT p.id, p.slug, p.name, p.subtitle, p.price, p.currency,
               p.color_name, p.color_hex, p.trim_hex, p.rail_kind, p.images,
               p.details, p.sizes, p.stock
        FROM products p
        WHERE p.rail_kind IS NOT NULL AND p.stock > 0
        ORDER BY p.sort_order ASC, p.id ASC
        LIMIT 10`),
      query(`
        SELECT c.*, COUNT(p.id)::int AS product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.sort_order ASC
        LIMIT 6`),
      query(`
        SELECT * FROM collections WHERE is_featured = TRUE
        ORDER BY created_at DESC LIMIT 1`),
      query(`
        SELECT
          (SELECT COUNT(*)::int FROM products) AS products,
          (SELECT COUNT(*)::int FROM categories) AS categories,
          (SELECT COUNT(*)::int FROM orders) AS orders,
          (SELECT COUNT(*)::int FROM members) AS members`),
    ]);

    return ok(res, {
      newArrivals: newArrivals.rows,
      featured: featured.rows,
      rail: rail.rows,
      categories: categories.rows,
      featuredCollection: featuredCollection.rows[0] || null,
      stats: stats.rows[0],
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getHome };
