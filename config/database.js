'use strict';

const { Pool } = require('pg');

function buildDatabaseUrl() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL.trim();
  }
  const host = process.env.PG_HOST || 'localhost';
  const port = process.env.PG_PORT || '5432';
  const user = process.env.PG_USER || 'postgres';
  const password = process.env.PG_PASSWORD || '';
  const database = process.env.PG_DATABASE || 'ecommerce_db';
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

const pool = new Pool({
  connectionString: buildDatabaseUrl(),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('[db] unexpected pool error', err.message);
});

async function query(text, params) {
  return pool.query(text, params);
}

async function transaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) { /* ignore */ }
    throw err;
  } finally {
    client.release();
  }
}

async function ping() {
  const res = await pool.query('SELECT 1 AS ok');
  return res.rows[0].ok === 1;
}

module.exports = { pool, query, transaction, ping, buildDatabaseUrl };
