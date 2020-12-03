import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const ai_settings_store = {
    state: {
        path: null,
        model: null,
        weight: null,
        image_size: null,
        confidence: 25
    },
    mutations: {
        setPath(state, path){
            state.path = path;
        },
        setAiSettings(state, payload){
            state.model = payload.model;
            state.weight = payload.weight;
            state.image_size = payload.image_size;
            state.confidence = payload.confidence;
        },
        resetSettings(state){
            state.path = null;
            state.model = null;
            state.weight = null;
            state.image_size = null;
            state.confidence = 25;        
        }
        
    },
    actions: {
        setPath({
            commit
        }, path) {
            commit("setPath", path);
        },
        setAiSettings({
            commit
        }, payload) {
            commit("setAiSettings", payload);
        },
        resetSettings({
            commit
        }) {
            commit("resetSettings");
        }
    },
    getters: {
        getPath: state => { return state.path },
        getModel: state => { return state.model },
        getWeight: state => { return state.weight },
        getImageSize: state => { return state.image_size },
        getConfidence: state => { return state.confidence },
        getAiSettings: state => { return state }
    },
};

export default ai_settings_store;