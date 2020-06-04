import { Router } from 'express';

import ItemController from './app/controllers/ItemController';
import PointController from './app/controllers/PointController';

const routes = Router();

routes.get('/users', (req, res) => {
  return res.json({
    nlw: true,
  });
});

routes.get('/items', ItemController.index);
routes.post('/items', ItemController.store);

routes.post('/points', PointController.store);
routes.get('/points/:id', PointController.show);

export default routes;