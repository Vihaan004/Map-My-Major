require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/mapRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const classRoutes = require('./routes/classRoutes');
const requirementRoutes = require('./routes/requirementRoutes');

const app = express();

// Set up CORS with specific configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Set up session
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Verify JWT_SECRET is loaded
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Define routes
app.use('/api/users', userRoutes); // Changed back to '/api/users' to be consistent
app.use('/api/maps', mapRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/semesters', classRoutes); // Mount class routes for semester operations
app.use('/api', requirementRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working correctly!' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Map-My-Major API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
