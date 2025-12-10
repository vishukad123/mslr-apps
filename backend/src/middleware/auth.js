const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isVoter = (req, res, next) => {
  if (req.user.role !== 'voter') return res.status(403).json({ error: 'Access denied' });
  next();
};

const isEC = (req, res, next) => {
  if (req.user.role !== 'ec') return res.status(403).json({ error: 'Access denied' });
  next();
};

module.exports = { verifyToken, isVoter, isEC };