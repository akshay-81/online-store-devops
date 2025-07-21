const pool = require('./db');

const createTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price DECIMAL(10, 2)
      );
    `;
    await pool.query(query);
    console.log("Table 'products' created or already exists.");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    pool.end(); // closes the DB connection
  }
};

async function userTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users table created successfully.");
    process.exit();
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

userTable();
createTable();
