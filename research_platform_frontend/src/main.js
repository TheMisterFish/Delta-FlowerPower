import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Axios from "axios";
import router from "./router";
import store from "./store";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.config.productionTip = false

const token = localStorage.getItem("token");

console.log(token);

if (token) {
    Axios.defaults.headers.common["Authorization"] = token;
}

Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyBc2Pf6i6qNU934cChcEozdBmyFaIvwjSA",
        libraries: "drawing"
    }
});

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')