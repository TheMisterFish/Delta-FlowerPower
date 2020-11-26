import Vuex from "vuex";
import Vue from "vue";
import { socketStore } from './modules/socketStore.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        socket: socketStore
    }
});