import Axios from "axios";
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        status: "",
        token: localStorage.getItem("token") || "",
        user: {},
    },
    mutations: {
        auth_request(state) {
            state.status = "loading";
        },
        auth_success(state, token, user) {
            state.status = "success";
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            state.status = "error";
        },
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                Axios({
                        url: "http://localhost:3000/login",
                        data: user,
                        method: "POST",
                    })
                    .then((response) => {
                        const token = response.data.token;
                        const user = response.data.user;
                        localStorage.setItem("token", token);
                        Vue.prototype.$http.defaults.headers.common[
                            "Authorization"
                        ] = token;
                        commit("auth_success", token, user);
                        resolve(response);
                    })
                    .catch((error) => {
                        commit("auth_error");
                        localStorage.removeItem("token");
                        reject(error);
                    });
            });
        },
    },
    modules: {},
});