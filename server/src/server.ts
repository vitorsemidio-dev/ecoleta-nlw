import 'dotenv/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';

const app = express();
import routes from './routes';
const { PORT = 3333 } = process.env;

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333, () => console.log(`Running on port ${PORT} and updating`));
