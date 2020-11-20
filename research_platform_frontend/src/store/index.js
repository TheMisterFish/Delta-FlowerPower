import Vuex from "vuex";
import Vue from "vue";
import { authenticationStore } from './modules/authenticationStore.js'
import { snackbarStore } from './modules/snackbarStore.js'
import { titleStore } from './modules/titleStore.js'
import { areasStore } from './modules/areasStore.js'
import { researchesStore } from "./modules/researchesStore.js";
import { usersStore } from "./modules/usersStore.js";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        authentication: authenticationStore,
        users: usersStore,
        snackbar: snackbarStore,
        title: titleStore,
        areas: areasStore,
        researches: researchesStore
    }
});