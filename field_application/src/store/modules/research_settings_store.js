import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const research_settings_store = {
    state: {
        sensor_width: null,
        focal_length: null,
        image_width: null,
    },
    mutations: {
        setResearchSettings(state, payload){
            state.sensor_width = payload.sensor_width;
            state.focal_length = payload.focal_length;
            state.image_width = payload.image_width;
        },
        
    },
    actions: {
        setResearchSettings({
            commit
        }, payload) {
            commit("setResearchSettings", payload);
        },
    },
    getters: {
        getSensorWidth: state => { return state.sensor_width },
        getFocalLength: state => { return state.focal_length },
        getImageWidth: state => { return state.image_width },
    },
};

export default research_settings_store;