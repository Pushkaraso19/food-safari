require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');

const catererRoutes = require('./routes/catererRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');

/**
 * Configure HTTP middleware and route handlers.
 */
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/caterers', catererRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Caterer API running at http://localhost:${PORT}`);
});

module.exports = app;
