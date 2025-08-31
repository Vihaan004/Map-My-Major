// Shared database connection for Vercel Functions
const { Sequelize } = require('sequelize');

let sequelize;

const getDatabase = () => {
  if (!sequelize) {
    // Use Supabase connection string
    sequelize = new Sequelize(process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false, // Disable logging in production
      pool: {
        max: 2, // Limit connections for serverless
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
  return sequelize;
};

// Import models
const User = require('../app/backend/src/models/user');
const Map = require('../app/backend/src/models/map');
const Semester = require('../app/backend/src/models/semester');
const Class = require('../app/backend/src/models/class');
const Requirement = require('../app/backend/src/models/requirement');

// Initialize models with the database connection
const initializeModels = () => {
  const db = getDatabase();
  
  const models = {
    User: User(db, Sequelize.DataTypes),
    Map: Map(db, Sequelize.DataTypes),
    Semester: Semester(db, Sequelize.DataTypes),
    Class: Class(db, Sequelize.DataTypes),
    Requirement: Requirement(db, Sequelize.DataTypes)
  };

  // Set up associations
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  return models;
};

module.exports = {
  getDatabase,
  initializeModels
};
