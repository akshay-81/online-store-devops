const express = require('express');
const pool = require('./db');

const app = express();
app.get('/', (_, res) => res.send('Hello, DevOps!'));

app.get('/test-db', async (_, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows); // Send array of products
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => console.log('API up on 3000'));
