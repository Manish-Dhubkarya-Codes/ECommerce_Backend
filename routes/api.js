'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');

const { ok } = require('../utils/apiResponse');
const { ping } = require('../config/database');
const home = require('../controllers/homeController');
const products = require('../controllers/productController');
const categories = require('../controllers/categoryController');
const newsletter = require('../controllers/newsletterController');
const orders = require('../controllers/orderController');

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: 'Too many requests, try again later.' } },
});

router.get('/health', async (req, res, next) => {
  try {
    const dbOk = await ping();
    return ok(res, { status: 'ok', db: dbOk, uptime: Math.round(process.uptime()) });
  } catch (err) {
    return next(err);
  }
});

router.get('/home', home.getHome);

router.get('/products', products.listProducts);
router.get('/products/filters', products.getFilters);
router.get('/products/rail', products.getRailItems);
router.get('/products/:slug', products.getProduct);
router.get('/products/:slug/related', products.getRelated);

router.get('/categories', categories.listCategories);
router.get('/categories/:slug', categories.getCategory);
router.get('/collections', categories.listCollections);
router.get('/collections/featured', categories.getFeaturedCollection);
router.get('/collections/:slug', categories.getCollection);

router.post('/newsletter', writeLimiter, newsletter.subscribe);
router.post('/membership', writeLimiter, newsletter.joinMembership);

router.get('/orders/promo', orders.previewPromo);
router.post('/orders', writeLimiter, orders.createOrder);
router.get('/orders/:orderNumber', orders.getOrder);

module.exports = router;
