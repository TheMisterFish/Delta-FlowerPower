import { GET_AREAS, GET_AREAS_SUCCESS, GET_AREAS_ERROR, ADD_AREA, ADD_AREA_SUCCESS, ADD_AREA_ERROR, DELETE_AREA, DELETE_AREA_SUCCESS, DELETE_AREA_ERROR, GET_AREA, GET_AREA_ERROR, GET_AREA_SUCCESS, UPDATE_AREA, UPDATE_AREA_SUCCESS, UPDATE_AREA_ERROR } from "../mutation_types";
import { getAreas, addArea, deleteArea, getArea, updateArea } from "../../api/api.js"

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
            console.log(areas);
            state.areas = areas;
        },
        [GET_AREAS_ERROR](state, message) {
            state.status = "error";
            state.message = message;
        },
        [GET_AREA](state) {
            state.status = "loading";
        },
        [GET_AREA_SUCCESS](state, area) {
            state.status = "success";
            if (!state.areas.find((a) => a._id === area._id)) {
                state.areas.push(area);
            }
        },
        [GET_AREA_ERROR](state) {
            state.status = "error"
        },
        [ADD_AREA](state) {
            state.status = "loading";
        },
        [ADD_AREA_SUCCESS](state, area) {
            state.status = "success";
            state.areas.push(area);
        },
        [ADD_AREA_ERROR](state) {
            state.status = "error";
        },
        [DELETE_AREA](state) {
            state.status = "loading";
        },
        [DELETE_AREA_SUCCESS](state, _id) {
            state.status = "success";
            state.areas = state.areas.filter(area => area._id != _id);
        },
        [DELETE_AREA_ERROR](state) {
            state.status = "error";
        },
        [UPDATE_AREA](state) {
            state.status = "loading";
        },
        [UPDATE_AREA_SUCCESS](state, area) {
            state.status = "success";
            state.areas = state.areas.filter(a => a._id !== area._id);
            state.areas.push(area);
        },
        [UPDATE_AREA_ERROR](state) {
            state.status = "error";
        }
    },
    actions: {
        getAreas({ commit }) {
            commit(GET_AREAS);
            return new Promise((resolve, reject) => {
                getAreas().then((response) => {
                        commit(GET_AREAS_SUCCESS, response.data);
                        resolve(response);
                    })
                    .catch((error) => {
                        commit(GET_AREAS_ERROR);
                        reject(error);
                    })
            })
        },

        getArea({ commit }, _id) {
            commit(GET_AREA);
            return new Promise((resolve, reject) => {
                getArea(_id).then((response) => {
                        commit(GET_AREA_SUCCESS, response.data);
                        resolve(response);
                    })
                    .catch((error) => {
                        commit(GET_AREA_ERROR);
                        reject(error);
                    })
            })
        },

        addArea({ commit }, area) {
            commit(ADD_AREA);
            return new Promise((resolve, reject) => {
                addArea(area).then((response) => {
                    commit(ADD_AREA_SUCCESS, response.data);
                    resolve(response);
                }).catch((error) => {
                    commit(ADD_AREA_ERROR);
                    reject(error);
                })
            })
        },

        deleteArea({ commit }, _id) {
            commit(DELETE_AREA);
            return new Promise((resolve, reject) => {
                deleteArea(_id).then((response) => {
                    commit(DELETE_AREA_SUCCESS);
                    resolve(response, _id);
                }).catch((error) => {
                    commit(ADD_AREA_ERROR);
                    reject(error);
                })
            })
        },

        updateArea({ commit }, payload) {
            console.log(payload);
            commit(UPDATE_AREA);
            return new Promise((resolve, reject) => {
                updateArea(payload._id, payload.area).then((response) => {
                    commit(UPDATE_AREA_SUCCESS, response.data);
                    resolve(response);
                }).catch((error) => {
                    commit(UPDATE_AREA_ERROR);
                    reject(error);
                })
            })
        }

    },
    modules: {},
}