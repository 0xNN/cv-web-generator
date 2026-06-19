const jwt = require('jsonwebtoken');

// Load JWT secret from environment variables or use a default one
const JWT_SECRET = process.env.JWT_SECRET || 'cvlabs-super-secret-key-123';

/**
 * Middleware to verify JWT tokens and protect routes.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  // Format should be: Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Token format must be Bearer <token>' });
  }
  
  const token = parts[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains id, email, name, subscription_tier
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = {
  verifyToken,
  JWT_SECRET
};