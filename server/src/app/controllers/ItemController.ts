import { Request, Response } from 'express';

import knex from '../../database/connection';

class ItemController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map(({ id, title, image }) => {
      return {
        id,
        title,
        image_url: `http://localhost:3333/uploads/${image}`,
      }
    });

    return res.json(serializedItems);
  }
}

export default new ItemController();