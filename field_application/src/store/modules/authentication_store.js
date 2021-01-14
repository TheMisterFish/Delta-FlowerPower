import Vue from "vue";
import Axios from 'axios';
import AuthApi from "../../api/AuthApi";

const authentication_store = {
    state: {
        status: "",
        token: localStorage.getItem("token") || "",
        user: {},
    },
    mutations: {
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
        async login({
            commit
        }, user) {
            const response = await AuthApi.login(user);

            if (response) {
                Vue.prototype.$http.defaults.headers.common["Authorization"] = `bearer ${response.access_token}`;
                localStorage.setItem("email", user.email);
                localStorage.setItem("password", user.password);
            }

            return response;

        },
    },
    modules: {},
}

export default authentication_store;