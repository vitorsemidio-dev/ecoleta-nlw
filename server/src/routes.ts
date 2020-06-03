import { Router } from 'express';

const routes = Router();

routes.get('/users', (req, res) => {
  return res.json({
    nlw: true,
  });
});

export default routes;