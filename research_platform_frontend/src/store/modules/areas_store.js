import { GET_AREAS, GET_AREAS_SUCCESS, GET_AREAS_ERROR, ADD_AREA, ADD_AREA_SUCCESS, ADD_AREA_ERROR, DELETE_AREA, DELETE_AREA_SUCCESS, DELETE_AREA_ERROR, GET_AREA, GET_AREA_ERROR, GET_AREA_SUCCESS, UPDATE_AREA, UPDATE_AREA_SUCCESS, UPDATE_AREA_ERROR } from "../mutation_types";
import { getAreas, addArea, deleteArea, getArea, updateArea } from "../../api/api.js"
import { STATUS, StoreResponse } from "../storeResponse";

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
        [GET_AREAS_ERROR](state) {
            state.status = "error";
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
        async getAreas({ commit }) {
            commit(GET_AREAS);
            try {
                const response = await getAreas();
                commit(GET_AREAS_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully fetched areas")
            } catch (error) {
                commit(GET_AREAS_ERROR);
                return new StoreResponse(STATUS.SUCCESS, "Error fetching areas")
            }
        },

        async getArea({ commit }, _id) {
            commit(GET_AREA);
            try {
                const response = await getArea(_id);
                commit(GET_AREA_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully fetched area", response.data);
            } catch (error) {
                commit(GET_AREA_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error fetching area");
            }
        },

        async addArea({ commit }, area) {
            commit(ADD_AREA);
            try {
                const response = await addArea(area);
                commit(ADD_AREA_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully added area", response.data);
            } catch (error) {
                commit(ADD_AREA_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error adding area");
            }
        },

        async deleteArea({ commit }, _id) {
            commit(DELETE_AREA);
            try {
                const response = await deleteArea(_id);
                commit(DELETE_AREA_SUCCESS, _id);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully deleted area", response.data);
            } catch (error) {
                commit(DELETE_AREA_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error deleting area");
            }
        },

        async updateArea({ commit }, payload) {
            commit(UPDATE_AREA);
            try {
                const response = await updateArea(payload._id, payload.area);
                commit(UPDATE_AREA_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully updated area", response.data);
            } catch (error) {
                commit(UPDATE_AREA_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error updating area", error);
            }
        }

    },
    modules: {},
}