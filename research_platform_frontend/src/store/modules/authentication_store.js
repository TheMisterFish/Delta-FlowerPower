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
            state.status = "loading";
        },
        auth_success(state, token, user) {
            localStorage.setItem("token", token);
            state.status = "success";
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            state.status = "error";
        },
        auth_logout(state) {
            localStorage.removeItem("token");
            state.token = ""
        }
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
                        console.log(response)
                        const token = response.data.access_token;
                        Axios.defaults.headers.common[
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
        logout({ commit }) {
            commit("auth_logout")
        }
    },
    modules: {},
}