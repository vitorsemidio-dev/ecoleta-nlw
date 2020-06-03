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

    await knex('points').insert({
      image: 'image-fake',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    });

    return res.json({
      ok: true,
    });
  }
}

export default new PointController();