require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/mapRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const classRoutes = require('./routes/classRoutes');
const requirementRoutes = require('./routes/requirementRoutes');

const app = express();

// Set up CORS with specific configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Verify JWT_SECRET is loaded
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Define routes
app.use('/api/users', userRoutes);
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
