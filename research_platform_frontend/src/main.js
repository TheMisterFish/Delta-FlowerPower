import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Axios from "axios";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false

const token = localStorage.getItem("token");

if (token) {
    Axios.defaults.headers.common["Authorization"] = token;
}

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')