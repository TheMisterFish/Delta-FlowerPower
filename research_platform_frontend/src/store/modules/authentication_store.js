import Axios from 'axios';
import { login } from '../../api/api';
import { LOGIN, LOGIN_ERROR, LOGIN_SUCCESSS, LOGOUT } from '../mutation_types';
import { STATUS, StoreResponse } from '../storeResponse';

export const authentication_store = {
    state: {
        status: "",
        token: localStorage.getItem("token") || "",
        authenticated: false,
        user: {},
    },
    mutations: {
        [LOGIN](state) {
            state.status = "loading";
        },
        [LOGIN_SUCCESSS](state, token, user) {
            Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
            state.status = "success";
            state.token = token;
            state.user = user;
            state.authenticated = true;
        },
        [LOGIN_ERROR](state) {
            state.status = "error";
            state.authenticated = false;
        },
        [LOGOUT](state) {
            localStorage.removeItem("token");
            state.token = ""
            state.authenticated = false;
        }
    },
    actions: {
        async login({ commit }, user) {
            commit(LOGIN);
            try {
                const response = await login(user);
                commit(LOGIN_SUCCESSS, response.data.access_token, user);
                return new StoreResponse(STATUS.SUCCESS, "Succesful login");
            } catch (error) {
                commit(LOGIN_ERROR)
                return new StoreResponse(STATUS.ERROR, "Incorrect email or password");
            }
        },
        logout({ commit }) {
            commit(LOGOUT);
            return new StoreResponse(STATUS.SUCCESS, "Succesful logout");
        }
    },
    modules: {},
}