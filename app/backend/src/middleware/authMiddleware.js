const passport = require('passport');

// JWT authentication middleware
exports.authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = user.id;
    next();
  })(req, res, next);
};

// Google authentication middleware
exports.authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Google authentication callback middleware
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    req.userId = user.id;
    next();
  })(req, res, next);
};
