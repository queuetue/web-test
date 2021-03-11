<template>
  <div>
    <h1>Restaurant {{ $route.params.restaurantID }}</h1>
    <h1>Reservations</h1>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Reservations',

  async mounted() {
    try {
      await axios.get('http://localhost:8080/restaurants/1/inventory_items')
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
