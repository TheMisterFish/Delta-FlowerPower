import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify'
import moment from 'moment'
import Axios from 'axios';
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyDSEJLDmpxwm0v7NLL3pE2VDNqZkfDoa-8',
        libraries: 'places', // This is required if you use the Autocomplete plugin
    },
})

moment.locale('nl')
window.moment = moment;

Vue.config.productionTip = false;

Vue.prototype.$vuetify = {
    rtl: false
};
Vue.prototype.$http = Axios;
localStorage.setItem("token", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmluY2VudCB2ZW5odWl6ZW4iLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6InYudmVuaHVpemVuQGZvbnR5cy5ubCIsIl9pZCI6IjVmYTMwM2Q4MzA3MDkxNDkwY2FiZDdlNCIsImlhdCI6MTYwODAyNzY0MCwiZXhwIjoxNzAyNzAwNDQwfQ.Z_wa72GWe1UxUob2MHKSC6r4hEQe1xn1ahTVwRc_8bQ")
const token = localStorage.getItem("token");

if (token) {
    Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}
Vue.prototype.$http.defaults.baseURL = process.env.VUE_APP_BASEURL;


Vue.component("alert", require("./components/AlertComponent.vue").default, );

// Input components
const req = require.context('./components/Inputs', true, /\.(js|vue)$/i);
req.keys().map(key => {
    const name = key.match(/\w+/)[0];
    return Vue.component(name, req(key).default)
});

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");