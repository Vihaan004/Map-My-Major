const { Pool } = require('pg');
const config = require('./src/config/config.json').development;

// Create a connection to PostgreSQL
const pool = new Pool({
  user: config.username,
  password: config.password,
  host: config.host,
  port: 5432,
});

// Create database
async function createDatabase() {
  try {
    const client = await pool.connect();
    try {
      // Check if database exists
      const checkResult = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = '${config.database}'`
      );
      
      if (checkResult.rowCount === 0) {
        console.log(`Creating database ${config.database}...`);
        // Disconnect all connections to the database before dropping
        await client.query(`CREATE DATABASE ${config.database}`);
        console.log(`Database ${config.database} created successfully.`);
      } else {
        console.log(`Database ${config.database} already exists.`);
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await pool.end();
  }
}

createDatabase();
