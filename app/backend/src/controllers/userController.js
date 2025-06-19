const { User, Map, Semester } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

/**
 * Register a new user with email and password
 */
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log(`-----USER REGISTERED: ${user.username} (${user.email})`);

    res.status(201).json({ 
      token, 
      userId: user.id, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Error in register endpoint:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
};

/**
 * Login with email and password
 */
exports.login = async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error in login authentication:', err);
      return res.status(500).json({ error: 'Authentication error' });
    }
    
    if (!user) {
      return res.status(400).json({ error: info ? info.message : 'Invalid email or password' });
    }
    
    // User authenticated, generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log(`-----USER LOGGED IN: ${user.username} (${user.email})`);
    
    return res.status(200).json({ 
      token, 
      userId: user.id,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  })(req, res, next);
};

/**
 * Google authentication callback
 */
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error in Google authentication:', err);
      return res.status(500).json({ error: 'Authentication error' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Google authentication failed' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log(`-----USER LOGGED IN WITH GOOGLE: ${user.username} (${user.email})`);
    
    // For API response, return JSON
    if (req.query.format === 'json') {
      return res.status(200).json({ 
        token, 
        userId: user.id,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture
        }
      });
    }
    
    // For browser flow, redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth-callback?token=${token}&userId=${user.id}`);
  })(req, res, next);
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};
