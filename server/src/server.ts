import 'dotenv/config';

import express from 'express';

const app = express();
const { PORT = 3333 } = process.env;

app.get('/users', (req, res) => {

  return res.json({ nlw: true });
});

app.listen(3333, () => console.log(`Running on port ${PORT} and updating`));
