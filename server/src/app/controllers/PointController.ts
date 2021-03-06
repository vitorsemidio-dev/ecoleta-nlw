import { Request, Response } from 'express';

import knex from '../../database/connection';

class PointController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    console.log(city, uf, items);

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    
    const points = await knex('points')
      .join('point_item', 'points.id', '=', 'point_item.point_id')
      .whereIn('point_item.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const host = process.env.HOST || 'http://localhost';
    const port = process.env.PORT || 3333;

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `${host}:${port}/uploads/${point.image}`,
      }
    });

    return res.json(serializedPoints);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return res.status(400).json({
        error: 'Point does not found'
      });
    }

    const host = process.env.HOST || 'http://localhost';
    const port = process.env.PORT || 3333;

    const serializedPoints = {
      ...point,
      image_url: `${host}:${port}/uploads/${point.image}`,
    };

    const items = await knex('items')
      .join('point_item', 'items.id', '=', 'point_item.item_id')
      .where('point_item.point_id', id)
      .select('items.title')

    return res.json({
      point: serializedPoints,
      items
    });
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
      image: req.file.filename,
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
  
      const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
        return {
          item_id,
          point_id,
        }
      });
  
      await trx('point_item').insert(pointItems);
      await trx.commit();
  
      return res.json({
        id: point_id,
        ...point
      });

    } catch (err) {
      await trx.rollback();
      return res.status(400).json({
        error: 'Fail to store Point',
      })
    }

  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return res.status(400).json({
        error: 'Point does not found'
      });
    }

    await knex('points').where('id', id).first().delete();

    return res.status(204).send();
  }
}

export default new PointController();