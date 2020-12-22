import Vuex from "vuex";
import Vue from "vue";
import authentication_store from './modules/authentication_store.js'
import alerts_store from './modules/alerts_store.js'
import socket_store from './modules/socket_store.js'
import ai_settings_store from './modules/ai_settings_store.js'
import research_settings_store from './modules/research_settings_store.js'
import drone_settings_store from './modules/drone_settings_store.js'
import models_store from './modules/models_store.js'
// import researches_store from './modules/researches_store.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        // researches: researches_store,
        models: models_store,
        socket: socket_store,
        authentication: authentication_store,
        alerts: alerts_store,
        ai_settings: ai_settings_store,
        research_settings: research_settings_store,
        drone_settings: drone_settings_store,
    }
});