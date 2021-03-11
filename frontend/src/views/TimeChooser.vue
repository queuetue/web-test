<template>
  <select
    v-model="$props.inventory.seatCount"
    @change="onChangeSeatCount($event, time)"
  >
    <option v-for="i in $data.seatCounts" :key="i" :value="i">
      {{ i }}
    </option>
  </select>
</template>
<script>
import axios from 'axios'

export default {
  name: 'TimeChooser',
  props: {
    time: Number,
    selectedDay: Number,
    restaurant: Object,
    inventory: Object
  },
  data() {
    return {
      times: [...Array(96).keys()], // 24 hours * 4 seating per hour
      seatCounts: [0, 10, 20, 30, 40, 50, 60, 63, 65, 70, 75, 80, 90, 150], // @todo This would be stored in a per-restaurant config
      seats: {}
    }
  },
  methods: {
    formatTime(time) {
      return new Date(
        this.$props.selectedDate.getTime() + time * 15 * 60000
      ).toLocaleTimeString('en-us')
    },
    async onChangeSeatCount(event, timeBlock) {
      this.restaurantLoading = true
      const fetchedID = this.$route.params.restaurantID
      const url = `http://localhost:8080/restaurants/${fetchedID}/seats/${this.$props.selectedDay}/block/${timeBlock}`
      const seatCount = event.target.value
      await axios
        .put(url, { seatCount })
        .then(result => {
          // console.log(result.data)
          this.restaurantLoading = false
        })
        .catch(err => {
          this.restaurantLoading = false
          console.log('There was a problem updating this seat count.')
          console.info(err)
        })
      this.$emit('fetchData', this.inventory.id)
    }
  }
}
</script>
