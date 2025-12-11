const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive user.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

// Check if user is master or admin
const isMasterOrAdmin = (req, res, next) => {
  if (req.user.role === 'master' || req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Master or Admin role required.' });
  }
};

// Check if user is master
const isMaster = (req, res, next) => {
  if (req.user.role === 'master') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Master role required.' });
  }
};

// Check if user belongs to company or is master/admin
const checkCompanyAccess = async (req, res, next) => {
  const companyId = req.params.companyId || req.body.companyId || req.query.companyId;
  
  if (req.user.role === 'master' || req.user.role === 'admin') {
    return next();
  }

  if (!companyId) {
    return res.status(400).json({ message: 'Company ID required.' });
  }

  if (req.user.companyId && req.user.companyId.toString() === companyId.toString()) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. You do not have access to this company.' });
  }
};

module.exports = {
  authenticate,
  isMasterOrAdmin,
  isMaster,
  checkCompanyAccess,
  JWT_SECRET
};

