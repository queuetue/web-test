import { Controller, Get, Put, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import * as models from '../models'

// @todo @security THIS CODE CONTAINS NO AUTHENTICATION.

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
    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: req.params.id } });
    if (resto) {
      return res.send(resto)
    } else {
      return res.sendStatus(404)
    }
  }

  @Get(":restaurantID/inventory_items")
  private async get_inventory_items_from_restaurant(req: Request, res: Response) {
    const restaurantID: number = parseInt(req.params.restaurantID)
    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: req.params.id } });
    if (resto) {
      const inventories: models.InventoryItem[] = await models.InventoryItem.findAndCountAll({ where: { restaurantId: restaurantID } });
      return res.send(inventories)
    } else {
      return res.sendStatus(404)
    }
  }

  @Get(":restaurantID/seats/:dayNumber")
  private async get_seat_from_day(req: Request, res: Response) {
    // @todo @security @ERROR needs a general catch block
    const restaurantId: number = parseInt(req.params.restaurantID)
    const dayNumber: number = parseInt(req.params.dayNumber)
    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: restaurantId } });
    if (resto) {
      const inventory: models.InventoryItem = await models.InventoryItem.findAndCountAll({ where: { dayNumber, restaurantId }, include: [models.Reservation] });
      if (inventory) {
        // const reservations: object = await models.Reservation.findAndCountAll({ where: { inventoryItemId: inventory.id } });
        return res.send({ inventory })
      }
      return res.send({ inventory: { count: 0, rows: [] } })
    }
    return res.sendStatus(404)
  }

  @Get(":restaurantID/seats/:dayNumber/block/:blockNumber")
  private async get_seat_from_block(req: Request, res: Response) {
    // @todo @security @ERROR needs a general catch block
    const restaurantId: number = parseInt(req.params.restaurantID)
    const dayNumber: number = parseInt(req.params.dayNumber)
    const blockNumber: number = parseInt(req.params.blockNumber)
    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: restaurantId } });
    if (resto) {
      const inventory: models.InventoryItem = await models.InventoryItem.findOne({ where: { dayNumber, blockNumber, restaurantId }, include: [models.Reservation] });
      if (inventory) {
        // const reservations: object = await models.Reservation.findAndCountAll({ where: { inventoryItemId: inventory.id } });
        // const rows = reservations["rows"]
        return res.send({ inventory })
      }
      return res.send({ inventory: { restaurantId, dayNumber, blockNumber, bookedCount: 0, availableCount: 0, seatCount: 0, id: null, reservations: [] } })
    }
    return res.sendStatus(404)
  }

  @Put(":restaurantID/seats/:dayNumber/block/:blockNumber")
  private async set_seat_info(req: Request, res: Response) {
    // @todo @security @ERROR needs a general catch block
    // @todo @refactor @perf There's a refactor hiding in this group of methods
    const restaurantId: number = parseInt(req.params.restaurantID)
    const dayNumber: number = parseInt(req.params.dayNumber)
    const blockNumber: number = parseInt(req.params.blockNumber)
    const seatCount: number = parseInt(req.body.seatCount)
    const name: string = req.body.name
    const email: string = req.body.email
    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: restaurantId } });

    if (!resto) {
      return res.status(404).send("That restaurant can't be found.")
    }
    if (seatCount < 0) {
      return res.status(406).send("Seat count must be a number, and must be 0 or greater.")
    }

    const inventory: models.InventoryItem = await models.InventoryItem.findOne({ where: { dayNumber, blockNumber, restaurantId } })
    if (inventory) {
      const reservations: object = await models.Reservation.findAndCountAll({ where: { inventoryItemId: inventory.id } });
      const rows = reservations["rows"]
      // Aggregate here instead of SQL, balance business logic flexibility vs offloaded performance
      const bookedCount = rows.reduce((acc: number, rez: models.Reservation) => (acc + rez.party_size), 0)
      const availableCount = Math.max(seatCount - bookedCount, 0)
      const result = await inventory.update({ seatCount, bookedCount, availableCount })
      return res.send({ inventory })
    } else {
      const newInventory = await models.InventoryItem.create({ restaurantId, dayNumber, blockNumber, seatCount, bookedCount: 0, availableCount: seatCount })
      return res.send({ inventory: newInventory, created: true })
    }
  }

  @Post(":restaurantID/inventory_items/:inventoryID/reserve")
  private async create_reservation(req: Request, res: Response) {
    // @todo @security @ERROR needs a general catch block
    // @todo @refactor There's a refactor hiding in this group of methods
    const restaurantId: number = parseInt(req.params.restaurantID)
    const inventoryId: number = parseInt(req.params.inventoryID)

    console.log("RESERVATION", inventoryId, restaurantId)

    if (!req.body.email) {
      return res.status(404).send("You must include an email.")
    }
    if (!req.body.name) {
      return res.status(404).send("You must include a name .")
    }
    if (!req.body.partySize) {
      return res.status(404).send("You must include a party size.")
    }

    const partySize: number = parseInt(req.body.partySize)

    if (partySize < 1) {
      return res.status(406).send("Party size must be a number, and must be 0 or greater.")
    }

    const name: string = req.body.name
    const email: string = req.body.email

    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: restaurantId } });
    if (!resto) {
      return res.status(404).send("That restaurant can't be found.")
    }


    const inventory: models.InventoryItem = await models.InventoryItem.findOne({ where: { id: inventoryId, restaurantId } })
    if (inventory) {
      const reservations: object = await models.Reservation.findAndCountAll({ where: { inventoryItemId: inventory.id } });
      const rows = reservations["rows"]
      // Aggregate here instead of SQL, balance business logic flexibility vs offloaded performance
      const bookedCount = rows.reduce((acc: number, rez: models.Reservation) => (acc + rez.party_size), 0) + partySize
      const availableCount = inventory.seatCount - bookedCount
      if (availableCount >= 0) {
        const reservation = await models.Reservation.create({ email, name, inventoryItemId: inventory.id, party_size: partySize })
        await inventory.update({ bookedCount, availableCount })
        return res.send({ reservation, inventory })
      } else {
        return res.status(406).send("There are not enough seats available in this inventory item.")
      }
    }
    return res.status(404).send("Error finding inventory item.")
  }

  @Get(":restaurantID/inventory_items/:inventoryID")
  private async get_inventory_item_from_restaurant(req: Request, res: Response) {
    const restaurantID: number = parseInt(req.params.restaurantID)
    const inventoryID: number = parseInt(req.params.inventoryID)
    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: restaurantID } });
    if (resto) {
      const inventory: models.InventoryItem[] = await models.InventoryItem.findOne({ where: { restaurantId: restaurantID, id: inventoryID } });
      if (inventory) {
        return res.send(inventory)
      } else {

      }
    }
    return res.sendStatus(404)
  }

  @Get(":restaurantID/inventory_items/:inventoryID/reservations")
  private async get_restaurant_reservations(req: Request, res: Response) {
    const restaurantID: number = parseInt(req.params.restaurantID)
    const inventoryID: number = parseInt(req.params.inventoryID)
    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: restaurantID } });
    if (resto) {
      const inventory_item: models.InventoryItem = await models.InventoryItem.findOne({ where: { restaurantId: restaurantID, id: inventoryID } });
      if (inventory_item) {
        const reservations = await models.Reservation.findAndCountAll({ where: { inventoryItemId: inventoryID } });
        return res.send(reservations)
      }
    }
    return res.sendStatus(404)
  }

  @Get(":restaurantID/inventory_items/:inventoryID/reservations/:reservationID")
  private async get_restaurant_reservation(req: Request, res: Response) {
    const restaurantID: number = parseInt(req.params.restaurantID)
    const inventoryID: number = parseInt(req.params.inventoryID)
    const reservationID: number = parseInt(req.params.reservationID)
    const resto: models.Restaurant = await models.Restaurant.findOne({ where: { id: restaurantID } });
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
}
