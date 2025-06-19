const express = require('express');
const { register, login, googleCallback, getProfile } = require('../controllers/userController');
const { authenticate, authenticateGoogle } = require('../middleware/authMiddleware');
const router = express.Router();

// Traditional authentication routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/auth/google', authenticateGoogle);
router.get('/auth/google/callback', googleCallback);

// Protected routes
router.get('/profile', authenticate, getProfile);

module.exports = router;
