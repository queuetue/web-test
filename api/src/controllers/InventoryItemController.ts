import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'
import * as models from '../models'

// @SECURITY @TODO THIS CODE CONTAINS NO AUTHENTICATION.

@Controller('inventory_items')
export class InventoryItemController {

  // @SECURITY @TODO just for debugging, remove once auth comes on line.
  @Get('')
  private async get_inventory_items(req: Request, res: Response) {

    const inventory_items: Array<models.InventoryItem> = await models.InventoryItem.findAndCountAll({
      limit: 10000,
      offset: 0
    });

    return res.send({
      items: inventory_items.length,
      count: inventory_items['count'],
      inventory_items: inventory_items['rows']
    })
  }

  // @SECURITY @TODO just for debugging, remove once auth comes on line.
  @Get(':id')
  private async get_inventory_item(req: Request, res: Response) {
    const inventory_item: models.InventoryItem = await models.InventoryItem.findOne({ "where": { id: req.params.id } });
    return res.send(inventory_item)
  }

}
