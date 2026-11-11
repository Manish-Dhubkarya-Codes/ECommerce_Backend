'use strict';

const { query } = require('../config/database');
const { ok, ApiError } = require('../utils/apiResponse');

async function listCategories(req, res, next) {
  try {
    const result = await query(
      `SELECT c.*, COUNT(p.id)::int AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       GROUP BY c.id
       ORDER BY c.sort_order ASC, c.name ASC`
    );
    return ok(res, result.rows);
  } catch (err) {
    return next(err);
  }
}

async function getCategory(req, res, next) {
  try {
    const result = await query('SELECT * FROM categories WHERE slug = $1', [req.params.slug]);
    if (!result.rows.length) throw new ApiError(404, 'Category not found');
    return ok(res, result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function listCollections(req, res, next) {
  try {
    const result = await query(
      `SELECT col.*, COUNT(p.id)::int AS product_count
       FROM collections col
       LEFT JOIN products p ON p.collection_id = col.id
       GROUP BY col.id
       ORDER BY col.is_featured DESC, col.created_at DESC`
    );
    return ok(res, result.rows);
  } catch (err) {
    return next(err);
  }
}

async function getCollection(req, res, next) {
  try {
    const result = await query('SELECT * FROM collections WHERE slug = $1', [req.params.slug]);
    if (!result.rows.length) throw new ApiError(404, 'Collection not found');
    return ok(res, result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function getFeaturedCollection(req, res, next) {
  try {
    const result = await query(
      `SELECT * FROM collections WHERE is_featured = TRUE
       ORDER BY created_at DESC LIMIT 1`
    );
    if (!result.rows.length) throw new ApiError(404, 'No featured collection');
    return ok(res, result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listCategories,
  getCategory,
  listCollections,
  getCollection,
  getFeaturedCollection,
};
