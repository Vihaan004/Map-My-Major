const { Sequelize } = require('sequelize');
const config = require('./src/config/config.json').development;

async function listTables() {
  // Create a new Sequelize instance
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: config.dialect,
      logging: false
    }
  );

  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Query to get all tables
    const [results] = await sequelize.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table'
      ORDER BY name;
    `);

    console.log('Tables in the database:');
    results.forEach(result => console.log(result.name));

    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

listTables();
