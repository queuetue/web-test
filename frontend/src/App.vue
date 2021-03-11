<template>
  <div id="app">
    <div v-if="$data.restaurantID">
      <div id="nav">
        <router-link to="/reservations">Reservations</router-link> |
        <router-link to="/inventory">Inventory</router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
import axios from 'axios'

export default {
  name: 'App',
  async mounted() {
    try {
      if (this.$route.params.restaurantID) {
        const url = `http://localhost:8080/restaurants/${this.$route.params.restaurantID}`
        await axios.get(url).then(result => {
          this.$data.restaurant = result.data
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
