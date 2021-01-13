import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const session_store = {
    state: {
        session: null,
    },
    mutations: {
        setCurrentSession(state, payload) {
            state.session = payload.session;
        },

    },
    actions: {
        setCurrentSession({
            commit
        }, payload) {
            commit("setCurrentSession", payload);
        },
    },
    getters: {
        getCurrentSession: state => {
            return state.session
        },
    },
};

export default session_store;