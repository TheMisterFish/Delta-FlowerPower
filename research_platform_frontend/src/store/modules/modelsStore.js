import { GET_MODELS, GET_MODELS_SUCCESS, GET_MODELS_ERROR, ADD_MODEL, ADD_MODEL_SUCCESS, ADD_MODEL_ERROR, DELETE_MODEL, DELETE_MODEL_SUCCESS, DELETE_MODEL_ERROR, GET_MODEL, GET_MODEL_ERROR, GET_MODEL_SUCCESS, UPDATE_MODEL, UPDATE_MODEL_SUCCESS, UPDATE_MODEL_ERROR } from "../mutationTypes";
import { STATUS, StoreResponse } from "../storeResponse";
import { addModel, deleteModel, getModel, getModels, updateModel } from "../../api/api"

export const modelsStore = {
    state: {
        models: [],
        status: "",
        message: ""
    },
    mutations: {
        [GET_MODELS](state) {
            state.status = "loading";
        },
        [GET_MODELS_SUCCESS](state, models) {
            state.status = "success";
            state.models = models;
        },
        [GET_MODELS_ERROR](state) {
            state.status = "error";
        },
        [GET_MODEL](state) {
            state.status = "loading";
        },
        [GET_MODEL_SUCCESS](state, model) {
            state.status = "success";
            if (!state.models.find((m) => m._id === model._id)) {
                state.models.push(model);
            }
        },
        [GET_MODEL_ERROR](state) {
            state.status = "error"
        },
        [ADD_MODEL](state) {
            state.status = "loading";
        },
        [ADD_MODEL_SUCCESS](state, model) {
            state.status = "success";
            state.models.push(model);
        },
        [ADD_MODEL_ERROR](state) {
            state.status = "error";
        },
        [DELETE_MODEL](state) {
            state.status = "loading";
        },
        [DELETE_MODEL_SUCCESS](state, _id) {
            state.status = "success";
            state.models = state.models.filter(m => m._id != _id);
        },
        [DELETE_MODEL_ERROR](state) {
            state.status = "error";
        },
        [UPDATE_MODEL](state) {
            state.status = "loading";
        },
        [UPDATE_MODEL_SUCCESS](state, model) {
            state.status = "success";
            console.log(model)
            state.models = state.models.filter(m => m._id !== model._id);
            state.models.push(model);
        },
        [UPDATE_MODEL_ERROR](state) {
            state.status = "error";
        }
    },
    actions: {
        async getModels({ commit }) {
            commit(GET_MODELS);
            try {
                const response = await getModels();
                commit(GET_MODELS_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully fetched models", response.data)
            } catch (error) {
                commit(GET_MODELS_ERROR);
                return new StoreResponse(STATUS.SUCCESS, "Error fetching models")
            }
        },

        async getModel({ commit }, _id) {
            commit(GET_MODEL);
            try {
                const response = await getModel(_id);
                commit(GET_MODEL_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully fetched model", response.data);
            } catch (error) {
                commit(GET_MODEL_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error fetching model");
            }
        },

        async addModel({ commit }, model) {
            commit(ADD_MODEL);
            try {
                const response = await addModel(model);
                commit(ADD_MODEL_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully added model", response.data);
            } catch (error) {
                commit(ADD_MODEL_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error adding model");
            }
        },

        async deleteModel({ commit }, _id) {
            commit(DELETE_MODEL);
            try {
                const response = await deleteModel(_id);
                commit(DELETE_MODEL_SUCCESS, _id);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully deleted model", response.data);
            } catch (error) {
                commit(DELETE_MODEL_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error deleting model");
            }
        },

        async updateModel({ commit }, payload) {
            commit(UPDATE_MODEL);
            try {
                const response = await updateModel(payload._id, payload.model);
                commit(UPDATE_MODEL_SUCCESS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully updated model", response.data);
            } catch (error) {
                commit(UPDATE_MODEL_ERROR);
                return new StoreResponse(STATUS.ERROR, "Error updating model", error);
            }
        }

    },
    modules: {},
}