// const jwt = require('jsonwebtoken');

// exports.authenticate = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ error: 'Access denied, no token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid token' });
//   }
// };


const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
