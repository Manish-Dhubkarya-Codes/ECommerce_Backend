'use strict';

const { query } = require('../config/database');
const { ok, ApiError } = require('../utils/apiResponse');
const { EMAIL_RE } = require('../middleware/validate');

async function subscribe(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const source = String(req.body.source || 'footer').slice(0, 60);
    if (!EMAIL_RE.test(email)) {
      throw new ApiError(422, 'Please enter a valid email address.');
    }
    const result = await query(
      `INSERT INTO newsletter_subscribers (email, source)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET is_active = TRUE, source = EXCLUDED.source
       RETURNING id, email, source, created_at`,
      [email, source]
    );
    return ok(res, {
      message: 'Welcome to the list. You will hear from us first.',
      subscriber: result.rows[0],
    });
  } catch (err) {
    return next(err);
  }
}

async function joinMembership(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const firstName = (req.body.firstName || '').trim().slice(0, 80) || null;
    const lastName = (req.body.lastName || '').trim().slice(0, 80) || null;
    const tier = ['atelier', 'premiere', 'noir'].includes(req.body.tier)
      ? req.body.tier
      : 'atelier';
    const preferences = req.body.preferences && typeof req.body.preferences === 'object'
      ? req.body.preferences
      : {};

    if (!EMAIL_RE.test(email)) {
      throw new ApiError(422, 'Please enter a valid email address.');
    }

    const existing = await query('SELECT id, tier FROM members WHERE email = $1', [email]);
    if (existing.rows.length) {
      return ok(res, {
        message: 'You are already a member of the house.',
        member: existing.rows[0],
        alreadyMember: true,
      });
    }

    const result = await query(
      `INSERT INTO members (email, first_name, last_name, tier, preferences)
       VALUES ($1, $2, $3, $4, $5::jsonb)
       RETURNING id, email, first_name, last_name, tier, created_at`,
      [email, firstName, lastName, tier, JSON.stringify(preferences)]
    );

    // Keep newsletter in sync so members also receive campaign mail.
    await query(
      `INSERT INTO newsletter_subscribers (email, source)
       VALUES ($1, 'membership')
       ON CONFLICT (email) DO UPDATE SET is_active = TRUE`,
      [email]
    );

    return ok(res, {
      message: 'Welcome to the house. Your membership is confirmed.',
      member: result.rows[0],
      alreadyMember: false,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { subscribe, joinMembership };
