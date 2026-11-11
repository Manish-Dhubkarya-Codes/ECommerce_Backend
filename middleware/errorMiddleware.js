'use strict';

const { ApiError, fail } = require('../utils/apiResponse');

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return fail(res, err.statusCode, err.message, err.details);
  }
  if (err && err.code === '23505') {
    return fail(res, 409, 'Resource already exists.');
  }
  if (err && err.code === '23503') {
    return fail(res, 400, 'Referenced resource does not exist.');
  }
  if (err && err.type === 'entity.parse.failed') {
    return fail(res, 400, 'Invalid JSON body.');
  }
  const status = err && (err.statusCode || err.status);
  if (status && status < 500) {
    return fail(res, status, (err && err.message) || 'Request failed');
  }
  console.error('[error]', err);
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : (err && err.message) || 'Internal server error';
  return fail(res, status || 500, message);
}

module.exports = { notFound, errorHandler, ApiError };
