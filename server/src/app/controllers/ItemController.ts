import { Request, Response } from 'express';

import knex from '../../database/connection';

class ItemController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const host = process.env.HOST || 'http://localhost';
    const port = process.env.PORT || 3333;

    const serializedItems = items.map(({ id, title, image }) => {
      return {
        id,
        title,
        image_url: `${host}:${port}/uploads/${image}`,
      }
    });

    return res.json(serializedItems);
  }

  async store(req: Request, res: Response) {

    const { title = 'Empty Title', image = 'empty-image.svg' } = req.body;

    const trx = await knex.transaction();

    try {
      const item = await trx('items').insert({
        title,
        image,
      });

      trx.commit();
  
      return res.json(item);
    } catch (err) {
      trx.rollback();

      return res.json({ error: 'Fail to Store Item' });
    }


  }
}

export default new ItemController();