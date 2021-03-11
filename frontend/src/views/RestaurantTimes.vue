<template>
  <ul>
    <li v-for="time in times" :key="time" style="list-style-type: none">
      <restaurant-time
        :time="time"
        :selectedDate="$data.selDate"
        :selectedDay="$data.selDay"
      />
    </li>
  </ul>
</template>
<script>
import RestaurantTime from './RestaurantTime.vue'
export default {
  components: { RestaurantTime },
  name: 'RestaurantTimes',
  props: {
    selectedDay: Number,
    selectedDate: Date,
    restaurant: Object
  },
  data() {
    return {
      times: [...Array(96).keys()], // 24 hours * 4 seating per hour
      selDay: this.selectedDay,
      selDate: this.selectedDate
    }
  },
  watch: {
    selectedDay: {
      handler(val) {
        this.$data.selDay = val
      },
      deep: true
    },
    selectedDate: {
      handler(val) {
        this.$data.selDate = val
      },
      deep: true
    }
  },
  methods: {
    formatTime(time) {
      return new Date(
        this.$props.selectedDate.getTime() + time * 15 * 60000
      ).toLocaleTimeString('en-us')
    }
  }
}
</script>
