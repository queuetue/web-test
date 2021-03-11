import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import VCalendar from 'v-calendar'

import Reservations from '../views/Reservations.vue'
import Reservation from '../views/Reservation.vue'
import Restaurants from '../views/Restaurants.vue'
import Restaurant from '../views/Restaurant.vue'
import Inventory from '../views/Inventory.vue'

Vue.use(VueRouter)
Vue.use(VCalendar)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/restaurants'
  },
  {
    path: '/restaurant',
    redirect: '/restaurants'
  },
  {
    path: '/restaurants',
    name: 'Restaurants',
    component: Restaurants
  },
  {
    path: '/restaurants/:restaurantID',
    name: 'Restaurant',
    component: Restaurant
  },
  {
    path: '/restaurants/:restaurantID/reserve/:inventoryID',
    name: 'Reservation',
    component: Reservation
  },
  {
    path: '/restaurants/:restaurantID/reservations',
    name: 'Reservations',
    component: Reservations
  },
  {
    path: '/restaurants/:restaurantID/inventory',
    name: 'Inventory',
    component: Inventory
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
