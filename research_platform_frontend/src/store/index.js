import Vuex from "vuex";
import Vue from "vue";
import { authentication_store } from './modules/authentication_store.js'
import { snackbar_store } from './modules/snackbar_store.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        authentication: authentication_store,
        snackbar: snackbar_store
    }
});