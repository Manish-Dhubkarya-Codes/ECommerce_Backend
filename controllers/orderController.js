'use strict';

const crypto = require('crypto');
const { query, transaction } = require('../config/database');
const { ok, ApiError } = require('../utils/apiResponse');
const { EMAIL_RE } = require('../middleware/validate');

const DELIVERY_METHODS = {
  standard: { label: 'Standard', cost: 0, eta: '5–7 business days' },
  express: { label: 'Express', cost: 18, eta: '2–3 business days' },
  overnight: { label: 'Overnight', cost: 35, eta: 'Next business day' },
};

const PROMOS = {
  MAISON10: { type: 'percent', value: 10, label: '10% off' },
  WELCOME: { type: 'amount', value: 20, label: '$20 off' },
  FREESHIP: { type: 'shipping', value: 0, label: 'Free express shipping' },
};

// Lightweight column upgrade so older DBs still work.
async function ensureOrderColumns() {
  await query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code TEXT');
  await query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT \'card\'');
}
ensureOrderColumns().catch((err) => {
  console.error('[orders] column ensure failed', err.message);
});

function orderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `EC-${stamp}-${rand}`;
}

function luhnValid(num) {
  const digits = String(num).replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function normalizeAddress(body) {
  const a = body.shippingAddress && typeof body.shippingAddress === 'object' ? body.shippingAddress : {};
  const pick = (k, max = 120) => String(a[k] || '').trim().slice(0, max);
  const address = {
    fullName: pick('fullName', 100),
    address1: pick('address1', 160),
    address2: pick('address2', 160),
    city: pick('city', 80),
    state: pick('state', 80),
    postalCode: pick('postalCode', 20),
    country: pick('country', 80) || 'United States',
  };
  if (!address.fullName || !address.address1 || !address.city || !address.postalCode || !address.country) {
    throw new ApiError(422, 'Please complete all required shipping fields.', [
      { field: 'shippingAddress', message: 'name, address, city, postal code and country are required' },
    ]);
  }
  return address;
}

function validatePayment(payment) {
  const p = payment && typeof payment === 'object' ? payment : {};
  const cardNumber = String(p.cardNumber || '').replace(/\s/g, '');
  const nameOnCard = String(p.nameOnCard || '').trim();
  const expiry = String(p.expiry || '').trim();
  const cvc = String(p.cvc || '').replace(/\s/g, '');

  if (!nameOnCard) throw new ApiError(422, 'Name on card is required.');
  if (!luhnValid(cardNumber)) throw new ApiError(422, 'Card number is not valid.');
  if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(expiry)) {
    throw new ApiError(422, 'Expiry must be in MM/YY format.');
  }
  const [mm, yy] = expiry.split('/').map((s) => Number(s.trim()));
  const now = new Date();
  const expYear = 2000 + yy;
  const expMonth = mm;
  const lastDay = new Date(expYear, expMonth, 0).getDate();
  if (now > new Date(expYear, expMonth - 1, lastDay, 23, 59, 59)) {
    throw new ApiError(422, 'Card has expired.');
  }
  if (!/^\d{3,4}$/.test(cvc)) throw new ApiError(422, 'Security code is invalid.');

  const brand =
    /^4/.test(cardNumber) ? 'visa'
    : /^5[1-5]/.test(cardNumber) ? 'mastercard'
    : /^3[47]/.test(cardNumber) ? 'amex'
    : 'card';

  return { brand, last4: cardNumber.slice(-4), nameOnCard };
}

async function applyPromo(code, subtotal, shippingCost) {
  if (!code) return { code: null, discount: 0, shippingCost, label: null };
  const key = String(code).trim().toUpperCase();
  const promo = PROMOS[key];
  if (!promo) throw new ApiError(422, 'That promo code is not valid.');

  if (promo.type === 'percent') {
    const discount = Math.round(subtotal * (promo.value / 100) * 100) / 100;
    return { code: key, discount, shippingCost, label: promo.label };
  }
  if (promo.type === 'amount') {
    const discount = Math.min(subtotal, promo.value);
    return { code: key, discount, shippingCost, label: promo.label };
  }
  // FREESHIP — waive shipping, escalate to express when free
  return { code: key, discount: 0, shippingCost: 0, label: promo.label };
}

async function createOrder(req, res, next) {
  try {
    const body = req.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) throw new ApiError(422, 'Please enter a valid email address.');

    const fullName = String(body.fullName || '').trim().slice(0, 100);
    if (!fullName) throw new ApiError(422, 'Full name is required.');
    const phone = String(body.phone || '').trim().slice(0, 30) || null;

    const address = normalizeAddress(body);
    address.fullName = address.fullName || fullName;

    const deliveryKey = Object.keys(DELIVERY_METHODS).includes(body.deliveryMethod)
      ? body.deliveryMethod
      : 'standard';
    const delivery = DELIVERY_METHODS[deliveryKey];

    const payment = validatePayment(body.payment);

    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) throw new ApiError(422, 'Your bag is empty.');

    const cleaned = items.map((item) => ({
      productId: Number(item.productId),
      size: String(item.size || 'One Size').slice(0, 40),
      quantity: Math.max(1, Math.min(20, Number(item.quantity) || 1)),
    }));
    for (const line of cleaned) {
      if (!Number.isFinite(line.productId) || line.productId <= 0) {
        throw new ApiError(422, 'Cart contains an invalid item.');
      }
    }

    const ids = [...new Set(cleaned.map((l) => l.productId))];
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    const productRes = await query(
      `SELECT id, slug, name, price, currency, stock, images
       FROM products WHERE id IN (${placeholders})`,
      ids
    );
    const byId = new Map(productRes.rows.map((row) => [row.id, row]));
    if (productRes.rows.length !== ids.length) {
      throw new ApiError(409, 'Some pieces in your bag are no longer available.');
    }

    const lineItems = cleaned.map((line) => {
      const product = byId.get(line.productId);
      if (product.stock < line.quantity) {
        throw new ApiError(409, `Only ${product.stock} left of ${product.name}.`, [
          { field: 'items', productId: product.id, available: product.stock },
        ]);
      }
      const images = Array.isArray(product.images) ? product.images : [];
      return {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        size: line.size,
        quantity: line.quantity,
        price: Number(product.price),
        currency: product.currency || 'USD',
        imageUrl: images[0] ? images[0].url : null,
      };
    });

    const subtotal = Math.round(lineItems.reduce((s, l) => s + l.price * l.quantity, 0) * 100) / 100;
    if (subtotal <= 0) throw new ApiError(422, 'Order total must be greater than zero.');

    let shippingCost = delivery.cost;
    let promoCode = null;
    let discount = 0;
    if (body.promoCode) {
      const applied = await applyPromo(body.promoCode, subtotal, shippingCost);
      promoCode = applied.code;
      discount = applied.discount;
      shippingCost = applied.shippingCost;
    }
    if (deliveryKey === 'express' && promoCode === 'FREESHIP') {
      shippingCost = 0;
    }

    const total = Math.max(0, Math.round((subtotal - discount + shippingCost) * 100) / 100);
    const number = orderNumber();
    const shippingJson = JSON.stringify({ ...address, phone });

    const created = await transaction(async (client) => {
      for (const line of cleaned) {
        const result = await client.query(
          `UPDATE products SET stock = stock - $1
           WHERE id = $2 AND stock >= $1
           RETURNING id, stock`,
          [line.quantity, line.productId]
        );
        if (!result.rowCount) {
          const p = byId.get(line.productId);
          throw new ApiError(409, `Not enough stock for ${p ? p.name : 'item'}.`);
        }
      }

      const insert = await client.query(
        `INSERT INTO orders (
           order_number, email, full_name, phone, shipping_address,
           delivery_method, subtotal, shipping_cost, discount, total, currency,
           payment_status, status, items, promo_code, payment_method
         ) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10,$11,'paid','placed',$12::jsonb,$13,$14)
         RETURNING id, order_number, email, full_name, phone, shipping_address,
                   delivery_method, subtotal, shipping_cost, discount, total, currency,
                   payment_status, status, items, promo_code, payment_method, created_at`,
        [
          number,
          email,
          fullName,
          phone,
          shippingJson,
          deliveryKey,
          subtotal,
          shippingCost,
          discount,
          total,
          lineItems[0].currency || 'USD',
          JSON.stringify(lineItems),
          promoCode,
          payment.brand,
        ]
      );
      return insert.rows[0];
    });

    return ok(res, {
      order: serializeOrder(created),
      payment: { ...payment, transactionId: `txn_${crypto.randomBytes(8).toString('hex')}` },
      delivery: { method: deliveryKey, label: delivery.label, eta: delivery.eta },
      message: 'Order placed. A confirmation is on its way.',
    }, undefined);
  } catch (err) {
    return next(err);
  }
}

function serializeOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    orderNumber: row.order_number,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    shippingAddress: row.shipping_address,
    deliveryMethod: row.delivery_method,
    deliveryLabel: (DELIVERY_METHODS[row.delivery_method] || DELIVERY_METHODS.standard).label,
    deliveryEta: (DELIVERY_METHODS[row.delivery_method] || DELIVERY_METHODS.standard).eta,
    subtotal: Number(row.subtotal),
    shippingCost: Number(row.shipping_cost),
    discount: Number(row.discount),
    total: Number(row.total),
    currency: row.currency,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method || 'card',
    status: row.status,
    items: row.items,
    promoCode: row.promo_code || null,
    createdAt: row.created_at,
  };
}

async function getOrder(req, res, next) {
  try {
    const number = String(req.params.orderNumber || '').trim();
    if (!number) throw new ApiError(400, 'Order number is required.');
    const result = await query('SELECT * FROM orders WHERE order_number = $1', [number]);
    if (!result.rows.length) throw new ApiError(404, 'Order not found.');
    return ok(res, { order: serializeOrder(result.rows[0]) });
  } catch (err) {
    return next(err);
  }
}

async function previewPromo(req, res, next) {
  try {
    const code = String((req.query && req.query.code) || '').trim();
    const subtotal = Number(req.query && req.query.subtotal);
    const delivery = String((req.query && req.query.delivery) || 'standard');
    if (!code) throw new ApiError(400, 'Promo code is required.');
    if (!Number.isFinite(subtotal) || subtotal < 0) {
      throw new ApiError(400, 'Subtotal is required.');
    }
    const baseShipping = (DELIVERY_METHODS[delivery] || DELIVERY_METHODS.standard).cost;
    const applied = await applyPromo(code, subtotal, baseShipping);
    return ok(res, {
      code: applied.code,
      discount: applied.discount,
      shippingCost: applied.shippingCost,
      label: applied.label,
      message: applied.label ? `Promo applied — ${applied.label}` : 'Promo applied',
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createOrder, getOrder, previewPromo, DELIVERY_METHODS, PROMOS };
