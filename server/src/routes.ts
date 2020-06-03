import { Router } from 'express';

import ItemController from './app/controllers/ItemController';

const routes = Router();

routes.get('/users', (req, res) => {
  return res.json({
    nlw: true,
  });
});

routes.get('/items', ItemController.index);

export default routes;