import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'
import * as models from '../models'

// @todo @security THIS CODE CONTAINS NO AUTHENTICATION.

@Controller('reservations')
export class ReservationController {

  // @todo @security just for debugging, remove once auth comes on line.
  @Get('')
  private async get_geservations(req: Request, res: Response) {
    const reservations: Array<models.Reservation> = await models.Reservation.findAndCountAll({
      limit: 10000,
      offset: 0
    });

    return res.send({
      items: reservations.length,
      count: reservations['count'],
      reservations: reservations['rows']
    })

  }

  // @todo @security just for debugging, remove once auth comes on line.
  @Get(':id')
  private async get_reservation(req: Request, res: Response) {
    const reservation: models.Reservation = await models.Reservation.findOne({ "where": { id: req.params.id } });
    return res.send(reservation)
  }

}
