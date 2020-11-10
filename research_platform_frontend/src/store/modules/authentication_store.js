import Axios from 'axios';

export const authentication_store = {
    state: {
        status: "",
        token: localStorage.getItem("token") || "",
        authenticated: false,
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
            state.authenticated = true;
        },
        auth_error(state) {
            state.status = "error";
            state.authenticated = false;
        },
        auth_logout(state) {
            localStorage.removeItem("token");
            state.token = ""
            state.authenticated = false;
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit("auth_request");
                Axios({
                        url: "http://localhost:7080/auth/login",
                        data: user,
                        method: "POST",
                    })
                    .then((response) => {
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