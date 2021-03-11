<template>
  <div>
    <h1>Restaurants</h1>
    <div v-if="restaurantsError" class="error">
      {{ restaurantsError }}
    </div>
    <div v-else>
      <div v-if="restaurantsLoading" class="loading">
        Loading...
      </div>
      <div v-if="restaurants" class="content">
        <li
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          style="  list-style-type: none;"
        >
          <router-link v-bind:to="`/restaurants/` + restaurant.id">{{
            restaurant.name
          }}</router-link>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Restaurants',
  data() {
    return {
      restaurantsLoading: false,
      restaurants: [],
      restaurantsError: null
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    fetchData() {
      this.restaurantsError = this.post = null
      this.restaurantsLoading = true
      try {
        const url = `http://localhost:8080/restaurants`
        axios
          .get(url)
          .then(result => {
            this.restaurants = result.data.restaurants
            this.restaurantsLoading = false
          })
          .catch(err => {
            this.restaurantsLoading = false
            this.restaurantsError = err
          })
      } catch (restaurantsError) {
        this.restaurantsError = restaurantsError
      }
    }
  }
}
</script>
