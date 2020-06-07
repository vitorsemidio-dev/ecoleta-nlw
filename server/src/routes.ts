import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';

import ItemController from './app/controllers/ItemController';
import PointController from './app/controllers/PointController';

const routes = Router();
const upload = multer(multerConfig);

routes.get('/items', ItemController.index);
routes.post('/items', ItemController.store);

routes.get('/points', PointController.index);
routes.get('/points/:id', PointController.show);
routes.delete('/points/:id', PointController.delete);

routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().length(2),
      items: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.string().required(),
    })
  }, {
    abortEarly: false
  }),
  PointController.store
);

export default routes;