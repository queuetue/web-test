<template>
  <div>
    <div v-if="loadingError" class="error">
      {{ loadingError }}
    </div>
    <div v-else>
      <div
        v-if="loading"
        class="loading"
        style="
          background-color: #ddd;
          padding: 5px;
          border-top: 1px solid black;
          border-left: 1px solid black;
          border-right: 1px solid black;
        "
      >
        Loading...
      </div>
      <div v-if="inventory" class="content">
        <li style="list-style-type: none">
          <div
            style="
              background-color: #ddd;
              padding: 5px;
              border-top: 1px solid black;
              border-left: 1px solid black;
              border-right: 1px solid black;
            "
          >
            <time-chooser
              :selectedDate="$props.selectedDate"
              :selectedDay="$props.selectedDay"
              :restaurant="$data.restaurant"
              :inventory="$data.inventory"
              :time="time"
              @fetchData="fetchData"
            />
            {{ formatTime(time) }}
            {{ inventory.availableCount }} / {{ inventory.seatCount }} ({{
              inventory.bookedCount
            }})
            <button
              v-if="inventory.availableCount > 0"
              v-on:click="addReservationButtonClick"
            >
              +
            </button>
          </div>
        </li>
        <div
          style="
            padding: 5px;
            margin-bottom: 2px;
            border-bottom: 1px solid black;
            border-left: 1px solid black;
            border-right: 1px solid black;
          "
        >
          <reservations-list
            :selectedDate="$props.selectedDate"
            :selectedDay="$props.selectedDay"
            :restaurant="$data.restaurant"
            :inventory="$data.inventory"
            :time="time"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import ReservationsList from './ReservationsList.vue'
import TimeChooser from './TimeChooser.vue'
export default {
  components: { TimeChooser, ReservationsList },
  name: 'RestaurantTime',
  props: {
    selectedDay: Number,
    selectedDate: Date,
    restaurant: Object,
    time: Number
  },
  data() {
    return {
      times: [...Array(96).keys()], // 24 hours * 4 seating per hour
      inventory: {},
      loading: false,
      loadingError: null
    }
  },
  watch: {
    $route: 'fetchData',
    selectedDay: function (newVal, oldVal) {
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    addReservationButtonClick() {
      const restaurantID = this.$route.params.restaurantID
      const inventoryID = this.inventory.id
      this.fetchData()
      this.$router.push(`/restaurants/${restaurantID}/reserve/${inventoryID}`)
    },
    formatTime(time) {
      return new Date(
        this.$props.selectedDate.getTime() + time * 15 * 60000
      ).toLocaleTimeString('en-us')
    },
    fetchData() {
      const fetchedID = this.$route.params.restaurantID
      this.loadingError = this.post = null
      this.loading = true
      try {
        const url = `http://localhost:8080/restaurants/${fetchedID}/seats/${this.selectedDay}/block/${this.$props.time}`
        axios
          .get(url)
          .then(result => {
            if (result) {
              this.inventory = result.data.inventory
            } else {
              this.inventory = { reservations: [], id: null }
            }
            this.loading = false
          })
          .catch(err => {
            console.log('SEAT ERROR', err)
            this.inventory = []
            this.loading = false
          })
      } catch (loadingError) {
        console.log('LOAD ERROR')
        this.loadingError = loadingError
      }
    }
  }
}
</script>
