'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { pool } = require('../config/database');
const { seed } = require('./seed');

async function run() {
  const schemaPath = path.join(__dirname, '..', '.init');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  console.log('[db:init] applying schema from .init ...');
  await pool.query(schemaSql);
  console.log('[db:init] schema OK');

  const countRes = await pool.query('SELECT COUNT(*)::int AS n FROM products');
  const productCount = countRes.rows[0].n;

  if (productCount === 0) {
    console.log('[db:init] seeding catalog ...');
    const stats = await seed(pool);
    console.log(`[db:init] seeded ${stats.categories} categories, ${stats.collections} collections, ${stats.products} products`);
  } else {
    console.log(`[db:init] catalog already has ${productCount} products — skipping seed`);
  }

  const email = (process.env.COMPANY_INITIAL_EMAIL || '').trim().toLowerCase();
  if (email) {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!existing.rows.length) {
      const hash = await bcrypt.hash('ChangeMe123!', 10);
      await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, 'Company', 'Admin', 'admin')`,
        [email, hash]
      );
      console.log(`[db:init] created admin user ${email} (password: ChangeMe123!)`);
    }
  }

  await pool.end();
  console.log('[db:init] done');
}

run().catch((err) => {
  console.error('[db:init] failed:', err);
  process.exit(1);
});
