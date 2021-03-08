import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'
import * as models from '../models'

// @SECURITY @TODO THIS CODE CONTAINS NO AUTHENTICATION.

@Controller('restaurants')
export class RestaurantController {
  @Get('')
  private async index(req: Request, res: Response) {
    const limit = 100;
    const pageInt = req.query.page ? parseInt(req.query.page.toString()) : 0
    const page = isFinite(pageInt) && !isNaN(pageInt) && pageInt > 0 ? pageInt : 1
    const offset = (page - 1) * limit

    const restos: Array<models.Restaurant> = await models.Restaurant.findAndCountAll({
      limit,
      offset,
      where: { "deleted_at": null },
    });

    return res.send({
      items: restos.length,
      count: restos['count'],
      restaurants: restos['rows']
    })
  }

  @Get(":id")
  private async get(req: Request, res: Response) {
    const resto: models.Restaurant = await this.find_resto(req.params.id);
    if (resto) {
      return res.send(resto)
    } else {
      return res.sendStatus(404)
    }
  }

  @Get(":restId/inventory_items")
  private async get_inventory_items_from_restaurant(req: Request, res: Response) {
    const restaurantID: number = parseInt(req.params.restId)
    const resto: models.Restaurant = await this.find_resto(restaurantID);
    if (resto) {
      const inventories: models.InventoryItem[] = await models.InventoryItem.findAndCountAll({ where: { restaurantId: restaurantID } });
      return res.send(inventories)
    } else {
      return res.sendStatus(404)
    }
  }

  @Get(":restId/inventory_items/:invId")
  private async get_inventory_item_from_restaurant(req: Request, res: Response) {
    const restaurantID: number = parseInt(req.params.restId)
    const inventoryID: number = parseInt(req.params.invId)
    const resto: models.Restaurant = await this.find_resto(restaurantID);
    if (resto) {
      const inventory: models.InventoryItem[] = await models.InventoryItem.findOne({ where: { restaurantId: restaurantID, id: inventoryID } });
      if (inventory) {
        return res.send(inventory)
      } else {

      }
    }
    return res.sendStatus(404)
  }

  @Get(":restId/inventory_items/:invId/reservations")
  private async get_restaurant_reservations(req: Request, res: Response) {
    const restaurantID: number = parseInt(req.params.restId)
    const inventoryID: number = parseInt(req.params.invId)
    const resto: models.Restaurant = await this.find_resto(restaurantID);
    if (resto) {
      const inventory_item: models.InventoryItem = await models.InventoryItem.findOne({ where: { restaurantId: restaurantID, id: inventoryID } });
      if (inventory_item) {
        const reservations = await models.Reservation.findAndCountAll({ where: { inventoryItemId: inventoryID } });
        return res.send(reservations)
      }
    }
    return res.sendStatus(404)
  }

  @Get(":restId/inventory_items/:invId/reservations/:reservID")
  private async get_restaurant_reservation(req: Request, res: Response) {
    const restaurantID: number = parseInt(req.params.restId)
    const inventoryID: number = parseInt(req.params.invId)
    const reservationID: number = parseInt(req.params.reservID)
    const resto: models.Restaurant = await this.find_resto(restaurantID);
    if (resto) {
      const inventory_item: models.InventoryItem = await models.InventoryItem.findOne({ where: { restaurantId: restaurantID, id: inventoryID } });
      if (inventory_item) {
        const reservation: models.Reservation = await models.Reservation.findOne({ where: { inventoryItemId: inventoryID, id: reservationID } });
        if (reservation) {
          return res.send(reservation)
        }
      }
    }
    return res.sendStatus(404)
  }


  private async find_resto(id: any): Promise<models.Restaurant> {
    // @TODO apply cache here @performance @cache @memoitize - queuetue
    return models.Restaurant.findOne({ where: { id: id } });
  }
}
