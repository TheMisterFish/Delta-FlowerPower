import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify'
import moment from 'moment'
import Axios from 'axios';

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