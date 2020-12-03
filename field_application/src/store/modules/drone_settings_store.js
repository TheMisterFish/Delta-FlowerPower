import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const drone_settings_store = {
    state: {
        fly_height: null,
        use_ftp: null,
    },
    mutations: {
        setDroneSettings(state, payload) {
            state.fly_height = payload.fly_height;
            state.use_ftp = payload.use_ftp;
        },

    },
    actions: {
        setDroneSettings({
            commit
        }, payload) {
            commit("setDroneSettings", payload);
        },
    },
    getters: {
        getFlyHeight: state => {
            return state.fly_height
        },
        useFtp: state => {
            return state.use_ftp
        },
    },
};

export default drone_settings_store;