const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'secret');

    // ✅ IMPORTANT: attach full user info
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('AUTH ERROR:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};