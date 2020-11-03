import Vue from "vue";
import Axios from 'axios';
import { API_URL } from "../../constants";

export const authentication_store = {
    state: {
        status: "",
        token: localStorage.getItem("token") || "",
        user: {},
    },
    mutations: {
        auth_request(state) {
            console.log('loggin in!!')
            state.status = "loading";
        },
        auth_success(state, token, user) {
            console.log('succesful login')
            localStorage.setItem("token", token);
            state.status = "success";
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            console.log('error login')
            state.status = "error";
        },
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                Axios({
                        url: `${API_URL}/auth/login`,
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
}