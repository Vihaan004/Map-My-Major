// Vercel Function for handling all API routes
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('../app/backend/src/config/passport');

const userRoutes = require('../app/backend/src/routes/userRoutes');
const mapRoutes = require('../app/backend/src/routes/mapRoutes');
const semesterRoutes = require('../app/backend/src/routes/semesterRoutes');
const classRoutes = require('../app/backend/src/routes/classRoutes');
const requirementRoutes = require('../app/backend/src/routes/requirementRoutes');

const app = express();

// Set up CORS
app.use(cors({
  origin: ['https://mapmymajor.com', 'https://www.mapmymajor.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/users', userRoutes);
app.use('/maps', mapRoutes);
app.use('/semesters', semesterRoutes);
app.use('/classes', classRoutes);
app.use('/', requirementRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

module.exports = app;
