import 'dotenv/config';

import express from 'express';
import path from 'path';

const app = express();
import routes from './routes';
const { PORT = 3333 } = process.env;

app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333, () => console.log(`Running on port ${PORT} and updating`));
