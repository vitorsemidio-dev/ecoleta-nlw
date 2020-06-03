import { Request, Response } from 'express';
import knex from '../../database/connection';

class ItemController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    return res.json(items);
  }
}

export default new ItemController();