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

createTable();
