const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log('protect middleware: received token:', token);
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('protect middleware: decoded JWT:', decoded);
    req.user = await User.findById(decoded.id).select('-password');
    console.log('protect middleware: loaded user:', req.user);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    console.log('protect middleware: token verification failed:', err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.adminOnly = (req, res, next) => {
  console.log('adminOnly middleware:', {
    user: req.user,
    role: req.user?.role
  });
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only', user: req.user });
  }
};

exports.adminOrStationMaster = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'station_master')) {
    next();
  } else {
    res.status(403).json({ message: 'Admin or Station Master access only' });
  }
}; 