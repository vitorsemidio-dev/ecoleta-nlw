import 'dotenv/config';

import express from 'express';

const app = express();
import routes from './routes';
const { PORT = 3333 } = process.env;

app.use(express.json());
app.use(routes);

app.listen(3333, () => console.log(`Running on port ${PORT} and updating`));
