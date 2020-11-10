import Vuex from "vuex";
import Vue from "vue";
import { authentication_store } from './modules/authentication_store.js'
import { snackbar_store } from './modules/snackbar_store.js'
import { title_store } from './modules/title_store.js'
import { areas_store } from './modules/areas_store.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        authentication: authentication_store,
        snackbar: snackbar_store,
        title: title_store,
        areas: areas_store
    }
});