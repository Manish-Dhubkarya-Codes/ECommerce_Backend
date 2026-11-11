'use strict';

const { query } = require('../config/database');
const { ok, ApiError } = require('../utils/apiResponse');

const PRODUCT_LIST_SQL = `
  SELECT p.id, p.slug, p.name, p.subtitle, p.price, p.compare_at_price, p.currency,
         p.gender, p.color_name, p.color_hex, p.trim_hex, p.rail_kind,
         p.images, p.sizes, p.details, p.tags, p.is_featured, p.is_new,
         p.stock, p.fabric,
         c.slug AS category_slug, c.name AS category_name,
         col.slug AS collection_slug, col.name AS collection_name
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN collections col ON col.id = p.collection_id
`;

function parseSort(sort) {
  switch (sort) {
    case 'price_asc': return 'p.price ASC, p.id ASC';
    case 'price_desc': return 'p.price DESC, p.id ASC';
    case 'name_asc': return 'p.name ASC, p.id ASC';
    case 'newest': return 'p.is_new DESC, p.created_at DESC, p.id ASC';
    case 'featured': return 'p.is_featured DESC, p.sort_order ASC, p.id ASC';
    default: return 'p.sort_order ASC, p.is_new DESC, p.id ASC';
  }
}

function buildFilters(q) {
  const where = [];
  const params = [];
  const add = (clause, value) => {
    params.push(value);
    where.push(clause.replace('?', `$${params.length}`));
  };

  if (q.search) {
    params.push(q.search);
    const idx = params.length;
    where.push(`(
      to_tsvector('english', coalesce(p.name,'') || ' ' || coalesce(p.subtitle,'') || ' ' || coalesce(p.description,''))
      @@ plainto_tsquery('english', $${idx})
      OR p.name ILIKE '%' || $${idx} || '%'
      OR coalesce(p.subtitle,'') ILIKE '%' || $${idx} || '%'
    )`);
  }
  if (q.category) add('c.slug = ?', q.category);
  if (q.collection) add('col.slug = ?', q.collection);
  if (q.gender && q.gender !== 'all') add('p.gender = ?', q.gender);
  if (q.color) add('p.color_name ILIKE ?', q.color);
  if (q.size) {
    params.push(q.size);
    const idx = params.length;
    where.push(`EXISTS (
      SELECT 1 FROM jsonb_array_elements(p.sizes) s
      WHERE s->>'size' = $${idx}
    )`);
  }
  if (q.minPrice !== undefined && q.minPrice !== null && q.minPrice !== '') {
    add('p.price >= ?', Number(q.minPrice));
  }
  if (q.maxPrice !== undefined && q.maxPrice !== null && q.maxPrice !== '') {
    add('p.price <= ?', Number(q.maxPrice));
  }
  if (q.featured === 'true') where.push('p.is_featured = TRUE');
  if (q.isNew === 'true') where.push('p.is_new = TRUE');
  if (q.inStock === 'true') where.push('p.stock > 0');

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params,
  };
}

async function listProducts(req, res, next) {
  try {
    const q = req.query;
    const page = Math.max(1, parseInt(q.page, 10) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(q.limit, 10) || 12));
    const offset = (page - 1) * limit;
    const { whereSql, params } = buildFilters(q);

    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN collections col ON col.id = p.collection_id
      ${whereSql}
    `;
    const countRes = await query(countSql, params);
    const total = countRes.rows[0].total;

    const listParams = [...params, limit, offset];
    const listSql = `
      ${PRODUCT_LIST_SQL}
      ${whereSql}
      ORDER BY ${parseSort(q.sort)}
      LIMIT $${listParams.length - 1} OFFSET $${listParams.length}
    `;
    const listRes = await query(listSql, listParams);

    return ok(res, listRes.rows, {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: page * limit < total,
    });
  } catch (err) {
    return next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const { slug } = req.params;
    const result = await query(`${PRODUCT_LIST_SQL} WHERE p.slug = $1`, [slug]);
    if (!result.rows.length) throw new ApiError(404, 'Product not found');
    return ok(res, result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

async function getRelated(req, res, next) {
  try {
    const { slug } = req.params;
    const result = await query(
      `${PRODUCT_LIST_SQL}
       WHERE p.slug <> $1
         AND (
           p.category_id = (SELECT category_id FROM products WHERE slug = $1)
           OR p.collection_id = (SELECT collection_id FROM products WHERE slug = $1)
         )
       ORDER BY p.is_featured DESC, p.sort_order ASC
       LIMIT 6`,
      [slug]
    );
    return ok(res, result.rows);
  } catch (err) {
    return next(err);
  }
}

async function getRailItems(req, res, next) {
  try {
    const result = await query(
      `${PRODUCT_LIST_SQL}
       WHERE p.rail_kind IS NOT NULL AND p.stock > 0
       ORDER BY p.sort_order ASC, p.is_new DESC, p.id ASC
       LIMIT 12`
    );
    return ok(res, result.rows);
  } catch (err) {
    return next(err);
  }
}

async function getFilters(req, res, next) {
  try {
    const [colors, sizes, price] = await Promise.all([
      query(`SELECT DISTINCT color_name AS name, color_hex AS hex
             FROM products WHERE color_name IS NOT NULL ORDER BY color_name`),
      query(`SELECT DISTINCT s->>'size' AS size
             FROM products p, jsonb_array_elements(p.sizes) s
             ORDER BY 1`),
      query(`SELECT MIN(price)::numeric AS min, MAX(price)::numeric AS max FROM products`),
    ]);
    return ok(res, {
      colors: colors.rows,
      sizes: sizes.rows.map((r) => r.size),
      priceRange: price.rows[0],
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listProducts, getProduct, getRelated, getRailItems, getFilters };
