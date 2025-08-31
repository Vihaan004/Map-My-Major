// User authentication endpoints
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initializeModels } = require('./database');
const { corsMiddleware, authenticate, errorHandler } = require('./middleware');

module.exports = async (req, res) => {
  try {
    // Apply CORS
    corsMiddleware(req, res, () => {});
    
    const { User } = initializeModels();
    
    if (req.method === 'POST') {
      const { path } = req.query;
      
      if (path && path[0] === 'register') {
        // Registration
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({
          where: {
            $or: [{ email }, { username }]
          }
        });

        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
          username,
          email,
          password: hashedPassword
        });

        // Generate token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
        
      } else if (path && path[0] === 'login') {
        // Login
        const { username, password } = req.body;
        
        if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await User.findOne({
          where: {
            $or: [{ email: username }, { username }]
          }
        });

        if (!user) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      }
    } else if (req.method === 'GET') {
      const { path } = req.query;
      
      if (path && path[0] === 'profile') {
        // Get profile (protected route)
        authenticate(req, res, async () => {
          const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'profilePicture']
          });
          
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          
          res.json(user);
        });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    errorHandler(error, req, res, () => {});
  }
};
