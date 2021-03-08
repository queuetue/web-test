import { Sequelize } from 'sequelize-typescript'
import { RouterServer } from '../RouterServer'
import * as models from '../models'
import supertest from 'supertest'

describe('InventoryItemController ', () => {

  let request: any, sequelize: any, server: any

  beforeAll(async () => {
    server = new RouterServer()
    request = supertest(server.app)

    sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
      logging: process.env.LOG === 'debug' ? console.log : false,
      models: Object.keys(models).map(k => models[k]),
    })

    await sequelize.sync({
      force: true
    })

  });

  it('should not have any inventory items', async done => {
    const resto = await models.Restaurant.create({ name: "Restaurant Zero" })
    let url: String, response: any
    url = `/restaurants/${resto.id}/inventory_items/`
    response = await request.get(url)
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(0)
    done()
  })

  it('should have one inventory item', async done => {
    const resto = await models.Restaurant.create({ name: "Restaurant Zero" })
    const inventory_item = await models.InventoryItem.create({ name: "Restaurant Zero Inventory Item", restaurantId: resto.id })
    let url: String, response: any
    url = `/restaurants/${resto.id}/inventory_items/`
    response = await request.get(url)
    done()
  })


})
