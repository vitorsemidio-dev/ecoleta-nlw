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

    console.log(req.body);

    const [ point_id, ] = await knex('points').insert({
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

    await knex('point_item').insert(pointItems);

    return res.json({
      ok: true,
    });
  }
}

export default new PointController();