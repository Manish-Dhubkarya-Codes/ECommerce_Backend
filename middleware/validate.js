'use strict';

const { fail } = require('../utils/apiResponse');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateBody(rules) {
  return (req, res, next) => {
    const errors = [];
    for (const rule of rules) {
      const { field, required, type, min, max, pattern, message } = rule;
      const value = req.body ? req.body[field] : undefined;
      if (value === undefined || value === null || value === '') {
        if (required) errors.push({ field, message: message || `${field} is required` });
        continue;
      }
      if (type === 'email' && !EMAIL_RE.test(String(value))) {
        errors.push({ field, message: message || `${field} must be a valid email` });
      }
      if (type === 'string') {
        if (typeof value !== 'string') {
          errors.push({ field, message: `${field} must be a string` });
        } else {
          if (min !== undefined && value.trim().length < min) {
            errors.push({ field, message: message || `${field} must be at least ${min} characters` });
          }
          if (max !== undefined && value.length > max) {
            errors.push({ field, message: message || `${field} must be at most ${max} characters` });
          }
        }
      }
      if (type === 'array' && !Array.isArray(value)) {
        errors.push({ field, message: `${field} must be an array` });
      }
      if (pattern && !pattern.test(String(value))) {
        errors.push({ field, message: message || `${field} is invalid` });
      }
    }
    if (errors.length) {
      return fail(res, 422, 'Validation failed', errors);
    }
    return next();
  };
}

module.exports = { validateBody, EMAIL_RE };
