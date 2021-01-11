import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const waypoints_store = {
    state: {
        waypoints: null,
    },
    mutations: {
        setWaypoints(state, payload) {
            state.waypoints = payload.waypoints;
        },
        resetWaypoints(state){
            state.waypoints = null;
        }

    },
    actions: {
        setWaypoints({
            commit
        }, payload) {
            commit("setWaypoints", payload);
        },
        resetWaypoints({
            commit
        }) {
            commit("resetWaypoints");
        },
    },
    getters: {
        getWaypoints: state => {
            return state.waypoints
        }
    },
};

export default waypoints_store;