/**
 * Server entry point.
 * - Loads env, connects to Mongo, starts Express app.
 */
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `[server] running in ${process.env.NODE_ENV || 'development'} on http://localhost:${PORT}`
      );
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('[unhandledRejection]', err);
  process.exit(1);
});
