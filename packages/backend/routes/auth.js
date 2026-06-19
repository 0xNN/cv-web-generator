const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Helper to validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 1. Basic Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide all required fields: email, password, name.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // 2. Check if user already exists
    const checkUserQuery = `SELECT * FROM users WHERE email = ${db.escape(trimmedEmail)} LIMIT 1`;
    const existingUsers = await db.query(checkUserQuery);

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Generate unique user ID (UUID)
    const userId = crypto.randomUUID();
    const defaultTier = 'free';

    // 5. Insert user into the database
    const insertQuery = `
      INSERT INTO users (id, email, password_hash, name, subscription_tier)
      VALUES (
        ${db.escape(userId)},
        ${db.escape(trimmedEmail)},
        ${db.escape(passwordHash)},
        ${db.escape(trimmedName)},
        ${db.escape(defaultTier)}
      )
    `;
    await db.query(insertQuery);

    // 6. Generate JWT token
    const payload = {
      id: userId,
      email: trimmedEmail,
      name: trimmedName,
      subscription_tier: defaultTier
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // 7. Return user details and token
    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: userId,
        email: trimmedEmail,
        name: trimmedName,
        subscription_tier: defaultTier
      }
    });

  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Find user in database
    const findUserQuery = `SELECT * FROM users WHERE email = ${db.escape(trimmedEmail)} LIMIT 1`;
    const users = await db.query(findUserQuery);

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // 4. Generate JWT token
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription_tier: user.subscription_tier
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    // 5. Return user details and token
    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription_tier: user.subscription_tier
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

module.exports = router;