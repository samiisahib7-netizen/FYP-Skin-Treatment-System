/**
 * Express app — middleware wiring + route mounting.
 * Routes are mounted in Phase 2 as modules come online.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security & parsing
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// CORS — allow client dev server
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Rate limiter for auth routes (mounted on routers later)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.set('authLimiter', authLimiter);

// Static uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Skin Treatment API is running.', data: { uptime: process.uptime() } });
});

// Mount feature routers (added module-by-module)
app.use('/api/v1/auth', require('./routes/auth.routes'));

// 404 + centralized error handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});
app.use(errorHandler);

module.exports = app;
