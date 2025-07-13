const express = require('express');
const app = express();
app.get('/', (_, res) => res.send('Hello, DevOps!'));
app.listen(3000, () => console.log('API up on 3000'));
