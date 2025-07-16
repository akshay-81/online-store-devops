const express = require('express');
const pool = require('./db');

const app = express();
app.get('/', (_, res) => res.send('Hello, DevOps!'));

app.get('/time', async (_, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.get('/test-db', async (_, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});


app.listen(3000, () => console.log('API up on 3000'));
