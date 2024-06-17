const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/mapRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const classRoutes = require('./routes/classRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
