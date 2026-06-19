const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cvlabs-secret-key-for-development';

/**
 * Middleware to verify JWT token from Authorization header.
 * Expected header format: "Bearer <token>"
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Access denied. Invalid authorization header format. Expected "Bearer <token>".' });
  }
  
  const token = parts[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = {
  verifyToken,
  JWT_SECRET
};
