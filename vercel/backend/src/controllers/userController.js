const { User, Map, Semester } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create default map with 8 semesters
    const map = await Map.create({ name: 'Map 0', userId: user.id });
    for (let i = 1; i <= 8; i++) {
      await Semester.create({ index: i, mapId: map.id });
    }

    console.log(`-----USER REGISTERED: ${user.username} (${user.email})`);

    res.status(201).json({ token, userId: user.id });
  } catch (error) {
    console.error('Error in register endpoint:', error);
    res.status(500).json({ error: 'User registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login endpoint hit:', { email, password }); // Log request data
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found'); // Log user not found
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password'); // Log invalid password
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    console.error('Error in login endpoint:', error); // Log the error
    res.status(500).json({ error: 'User login failed' });
  }
};
