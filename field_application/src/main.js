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
        // OR: libraries: 'places,drawing'
        // OR: libraries: 'places,drawing,visualization'
        // (as you require)

        //// If you want to set the version, you can do so:
        // v: '3.26',
    },

    //// If you intend to programmatically custom event listener code
    //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
    //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
    //// you might need to turn this on.
    // autobindAllEvents: false,

    //// If you want to manually install components, e.g.
    //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
    //// Vue.component('GmapMarker', GmapMarker)
    //// then disable the following:
    // installComponents: true,
})

moment.locale('nl')
window.moment = moment;

Vue.config.productionTip = false;

Vue.prototype.$vuetify = {
    rtl: false
};
Vue.prototype.$http = Axios;
// localStorage.setItem("token", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVzZWFyY2hlciIsInJvbGUiOiJyZXNlYXJjaGVyIiwiZW1haWwiOiJyZXNlYXJjaGVyQGZsb3dlcnBvd2VyLmNvbSIsIl9pZCI6IjVmYzYzMTEyYWI2YmQ5MDQ1MWU4M2E4ZSIsImlhdCI6MTYwNzAwODc2MiwiZXhwIjoxNjQzMjk2NzYyfQ.HDSEaruCXUoITF-a00abxkG2HJ_Es1iTSJDNO69oEJc")
const token = localStorage.getItem("token");

if (token) {
    Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

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