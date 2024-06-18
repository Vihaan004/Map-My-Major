require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/mapRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const classRoutes = require('./routes/classRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Verify JWT_SECRET is loaded
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/classes', classRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Map-My-Major API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
