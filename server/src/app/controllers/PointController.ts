import { Request, Response } from 'express';

import knex from '../../database/connection';

class PointController {
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return res.status(400).json({
        error: 'Point does not found'
      });
    }

    return res.json(point);
  }
  async store(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const trx = await knex.transaction();

    const point = {
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    }

    try {
      const [ point_id, ] = await trx('points').insert(point);
  
      const pointItems = items.map((item_id: number) => {
        return {
          item_id,
          point_id,
        }
      });
  
      await trx('point_item').insert(pointItems);
      trx.commit();
  
      return res.json({
        id: point_id,
        ...point
      });

    } catch (err) {
      trx.rollback();
      return res.status(400).json({
        error: 'Fail to store Point',
      })
    }

  }
}

export default new PointController();