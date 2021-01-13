import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const waypoints_store = {
    state: {
        waypoints: null,
        heading: null,
    },
    mutations: {
        setWaypointSettings(state, payload) {
            state.waypoints = payload.waypoints;
            state.heading = payload.heading;
        },
        resetWaypoints(state){
            state.waypoints = null;
            state.heading = null;
        }

    },
    actions: {
        setWaypointSettings({
            commit
        }, payload) {
            commit("setWaypointSettings", payload);
        },
        resetWaypoints({
            commit
        }) {
            commit("resetWaypoints");
        },
    },
    getters: {
        getWaypoints: state => {
            return state.waypoints;
        },
        getHeading: state => {
            return state.heading;
        }
    },
};

export default waypoints_store;