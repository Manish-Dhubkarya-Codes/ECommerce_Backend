'use strict';

class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

function ok(res, data, meta) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.json(body);
}

function fail(res, statusCode, message, details) {
  return res.status(statusCode).json({
    success: false,
    error: { message, details: details || null },
  });
}

module.exports = { ApiError, ok, fail };
