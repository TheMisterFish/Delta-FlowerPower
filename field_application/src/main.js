import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify'
import moment from 'moment' 

moment.locale('nl')
window.moment = moment;

Vue.config.productionTip = false;

Vue.prototype.$vuetify = { rtl: false };

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