import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const research_settings_store = {
    state: {
        alert_active: false,
        alert_text: null
    },
    mutations: {
        alert(state, payload) {
            if (payload.text) {
                state.alert_text = payload.text
            } else {
                state.alert_text = "Onbekende bericht"
            }
            state.alert_active = true;
        },
    },
    actions: {
        alert({
            commit
        }, payload) {
            commit("alert", payload);
        },
    },
    getters: {
        hasAlert: state => state.alert_active,
        alertText: state => state.alert_text
    },
};

export default research_settings_store;