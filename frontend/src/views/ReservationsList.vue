<template>
  <div v-if="inventory">
    <div v-for="r in inventory.reservations" :key="r.id">
      {{ r.id }} {{ r.name }} / {{ r.email }} // {{ r.party_size }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReservationsList',
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
    }
  }
}
</script>
