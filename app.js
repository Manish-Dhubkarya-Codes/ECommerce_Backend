'use strict';

require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// view engine setup (utility pages only — storefront is React)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];
if (process.env.FRONTEND_ORIGIN) {
  for (const o of process.env.FRONTEND_ORIGIN.split(',')) {
    const t = o.trim();
    if (t && !allowedOrigins.includes(t)) allowedOrigins.push(t);
  }
}
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
