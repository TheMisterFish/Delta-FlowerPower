import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Axios from "axios";
import router from "./router";
import store from "./store";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.config.productionTip = false

const token = localStorage.getItem("token");

if (token) {
    Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyBoQL0WXDWYdlgWW4W0xk96NsoONQ1RC4E",
        libraries: "drawing"
    }
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')