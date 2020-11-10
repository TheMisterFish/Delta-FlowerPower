import { GET_AREAS, GET_AREAS_SUCCESS, GET_AREAS_ERROR } from "../mutation_types";
import { getAreas as getAreasFunction } from "../../api/api.js"

export const areas_store = {
    state: {
        areas: [],
        status: "",
        message: ""
    },
    mutations: {
        [GET_AREAS](state) {
            state.status = "loading";
        },
        [GET_AREAS_SUCCESS](state, areas) {
            state.status = "success";
            state.areas = areas;
        },
        [GET_AREAS_ERROR](state, message) {
            state.status = "error";
            state.message = message;
        }
    },
    actions: {
        getAreas({ commit }) {
            commit(GET_AREAS);
            return new Promise((resolve, reject) => {
                getAreasFunction().then((response) => {
                        console.log(response.data);
                        commit(GET_AREAS_SUCCESS, response.data);
                        resolve(response);
                    })
                    .catch((error) => {
                        commit(GET_AREAS_ERROR);
                        reject(error);
                    })
            })
        }
    },
    modules: {},
}