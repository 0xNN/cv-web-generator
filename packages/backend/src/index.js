const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const cvsRoutes = require('./routes/cvs');
const { verifyToken } = require('./middleware/auth');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Auth Routes
app.use('/api/auth', authRoutes);

// CV CRUD Routes
app.use('/api/cvs', cvsRoutes);

// Protected Test Route
app.get('/api/protected', verifyToken, async (req, res) => {
  try {
    const selectSql = `SELECT id, email, name, subscription_tier, created_at FROM users WHERE id = ${db.escape(req.user.id)} LIMIT 1`;
    const users = await db.query(selectSql);
    
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    return res.json({
      message: 'You have accessed a protected endpoint successfully!',
      user: users[0]
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Base endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'CVLabs API',
    version: '1.0.0',
    description: 'Core backend service for CVLabs Resume Builder'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred on the server.'
  });
});

// Start the server, bound to all network interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CVLabs Backend Server is running on port ${PORT} (bound to 0.0.0.0)`);
});
