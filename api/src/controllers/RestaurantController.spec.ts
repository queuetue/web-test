import { Sequelize } from 'sequelize-typescript'
import { RouterServer } from '../RouterServer'
import * as models from '../models'
import supertest from 'supertest'

describe('RestaurantController', () => {

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

  it('should not have any restaurants', async done => {
    const response = await request.get('/restaurants')
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(0)
    done()
  })

  it('should have one restaurant with one inventory and one reservation', async done => {
    const resto = await models.Restaurant.create({ name: "Restaurant Zero" })
    const inventory_item = await models.InventoryItem.create({ name: "Restaurant Zero Inventory Item", restaurantId: resto.id })
    const reservation = await models.Reservation.create({ inventoryItemId: inventory_item.id, restaurantId: resto.id })

    let response: any

    response = await request.get(`/restaurants`)
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(1)

    response = await request.get(`/restaurants/${resto.id}`)
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(1)

    response = await request.get(`/restaurants/${resto.id}/inventory_items/${inventory_item.id}/reservations`)
    expect(response.status).toBe(200)
    expect(response.body.count).toBe(1)

    done()
  })


})
