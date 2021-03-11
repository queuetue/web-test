import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
Vue.config.productionTip = false;
axios.defaults.baseURL = 'http://localhost:8080';
// router.beforeEach((to, from, next) => {
//   if (!store.getters.restaurantID && to.name !== 'restaurants.create') {
//     next({ name: 'restaurants.create' })
//   } else {
//     next()
//   }
// })
const data = {
    restaurantId: null,
    restaurant: { id: null, name: 'not set' },
    restaurants: [],
    inventoryItems: [],
    reservations: []
};
new Vue({
    data,
    router,
    render: h => h(App)
}).$mount('#app');
//# sourceMappingURL=main.js.map