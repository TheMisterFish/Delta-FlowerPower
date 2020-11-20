import { getUsers } from "../../api/api";
import { GET_USERS, GET_USERS_ERROR, GET_USERS_SUCCESS } from "../mutationTypes";
import { STATUS, StoreResponse } from "../storeResponse";

export const usersStore = {
    state: {
        users: [],
        status: "",
        message: ""
    },
    mutations: {
        [GET_USERS](state) {
            state.status = "loading";
        },
        [GET_USERS_SUCCESS](state, users) {
            state.users = users;
            state.status = "success";
        },
        [GET_USERS_ERROR](state) {
            state.status = "error";
        }
    },
    actions: {
        async getUsers({ commit }) {
            commit(GET_USERS);
            try {
                const response = await getUsers();
                commit(GET_USERS_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully fetched users", response.data);
            } catch (error) {
                commit(GET_USERS_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error fetching users...");
            }
        }
    }
}