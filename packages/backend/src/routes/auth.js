const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

// Simple regex for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // 1. Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide email, password, and name.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (!trimmedName) {
      return res.status(400).json({ error: 'Name cannot be empty.' });
    }

    // 2. Check if user already exists
    const checkUserSql = `SELECT id FROM users WHERE email = ${db.escape(trimmedEmail)} LIMIT 1`;
    const existingUsers = await db.query(checkUserSql);

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'A user with this email address already exists.' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create unique ID and default tier
    const id = crypto.randomUUID();
    const defaultTier = 'free';

    // 5. Insert into DB
    const insertSql = `
      INSERT INTO users (id, email, password_hash, name, subscription_tier)
      VALUES (
        ${db.escape(id)},
        ${db.escape(trimmedEmail)},
        ${db.escape(passwordHash)},
        ${db.escape(trimmedName)},
        ${db.escape(defaultTier)}
      )
    `;
    await db.query(insertSql);

    // 6. Generate JWT token
    const tokenPayload = {
      id,
      email: trimmedEmail,
      name: trimmedName,
      subscription_tier: defaultTier
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    // 7. Return user info and token
    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id,
        email: trimmedEmail,
        name: trimmedName,
        subscription_tier: defaultTier
      }
    });

  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Query user from DB
    const selectSql = `SELECT * FROM users WHERE email = ${db.escape(trimmedEmail)} LIMIT 1`;
    const users = await db.query(selectSql);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 4. Generate token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription_tier: user.subscription_tier
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    // 5. Return response
    return res.json({
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription_tier: user.subscription_tier
      }
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
