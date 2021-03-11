<template>
  <div class="restaurantDetail">
    <div v-if="restaurantError" class="error">
      {{ restaurantError }}
    </div>
    <div v-else>
      <div v-if="restaurantLoading" class="loading">Loading...</div>
      <div v-if="restaurant" class="content">
        <h2>{{ restaurant.name }}</h2>
        <h4>{{ restaurant.address }}</h4>
        <hr />
        <v-calendar mode="date" v-model="selectedDate" @dayclick="onDayClick" />
        <hr />
        <h4>
          {{ $data.selectedDate.toLocaleDateString('en-us') }}
        </h4>
        <restaurant-times
          v-if="$data.selectedDate"
          :selectedDay="selectedDay"
          :selectedDate="selectedDate"
          :restaurant="restaurant"
        />
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import RestaurantTimes from './RestaurantTimes.vue'
export default {
  components: { RestaurantTimes },
  name: 'Restaurant',
  data() {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    const days = this.dateToDays(d)
    return {
      restaurantLoading: false,
      restaurant: null,
      restaurantError: null,
      selectedDay: days,
      selectedDate: d
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    epochOrigin() {
      return new Date('01/01/2021')
    },
    dateToDays(date = new Date()) {
      return Math.ceil(
        (date.getTime() - this.epochOrigin().getTime()) / (1000 * 60 * 60 * 24)
      )
    },
    daysToDate(days) {
      return new Date(
        this.epochOrigin.getTime() + Math.floor(days) * 1000 * 60 * 60 * 24
      )
    },
    onDayClick(day) {
      this.fetchData()
      const d = new Date(day.date)
      d.setHours(0, 0, 0, 0)
      this.selectedDate = d
      this.selectedDay = this.dateToDays(d)
    },
    fetchData() {
      const fetchedID = this.$route.params.restaurantID
      this.restaurantError = this.post = null
      this.restaurantLoading = true
      try {
        const url = `http://localhost:8080/restaurants/${fetchedID}`
        axios
          .get(url)
          .then(result => {
            this.restaurant = result.data
            this.restaurantLoading = false
          })
          .catch(err => {
            this.restaurantLoading = false
            this.restaurantError = err
          })
      } catch (restaurantError) {
        this.restaurantError = restaurantError
      }
    }
  }
}
</script>
