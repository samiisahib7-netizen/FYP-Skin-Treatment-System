/**
 * Express app — middleware wiring + route mounting.
 * Routes are mounted in Phase 2 as modules come online.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');

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

// Rate limiter is defined in middlewares/rateLimiter.js and used by the auth router.

// Static uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
const { isMockMode: emailMock } = require('./services/emailService');

app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'Skin Treatment API is running.',
    data: { uptime: process.uptime(), emailMock: emailMock() },
  });
});

// Mount feature routers (added module-by-module)
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/doctors', require('./routes/doctor.routes'));
app.use('/api/v1/patients', require('./routes/patient.routes'));
app.use('/api/v1/riders', require('./routes/rider.routes'));
app.use('/api/v1/appointments', require('./routes/appointment.routes'));
app.use('/api/v1/prescriptions', require('./routes/prescription.routes'));
app.use('/api/v1/reports', require('./routes/report.routes'));
app.use('/api/v1/products', require('./routes/product.routes'));
app.use('/api/v1/orders', require('./routes/order.routes'));
app.use('/api/v1/payments', require('./routes/payment.routes'));
app.use('/api/v1/notifications', require('./routes/notification.routes'));
app.use('/api/v1/reviews', require('./routes/review.routes'));
app.use('/api/v1/analytics', require('./routes/analytics.routes'));

// 404 + centralized error handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});
app.use(errorHandler);

module.exports = app;
