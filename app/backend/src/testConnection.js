const { Sequelize } = require('sequelize');
require('dotenv').config();

// Load the configuration based on environment
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

let sequelize;
if (config.use_env_variable && process.env[config.use_env_variable]) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: 'postgres'
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: config.dialect
    }
  );
}

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

// Execute the test function
testConnection();

testConnection();
