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

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.use(express.json()); // Enable JSON parsing

// Add multiple products
app.post('/api/products', async (req, res) => {
  const products = req.body; // expect array of {name, price}
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Expected an array of products' });
  }

  try {
    const inserted = [];
    for (const product of products) {
      const { name, price } = product;
      const result = await pool.query(
        'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
        [name, price]
      );
      inserted.push(result.rows[0]);
    }
    res.json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding products' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  // Validate input
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: 'Invalid input: name and price are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *',
      [name, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});


app.listen(3000, () => console.log('API up on 3000'));
