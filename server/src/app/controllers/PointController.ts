import { Request, Response } from 'express';

import knex from '../../database/connection';

class PointController {
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

    try {  
      const [ point_id, ] = await trx('points').insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      });
  
      const pointItems = items.map((item_id: number) => {
        return {
          item_id,
          point_id,
        }
      })
  
      await trx('point_item').insert(pointItems);
      trx.commit();
  
      return res.json({
        ok: true,
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