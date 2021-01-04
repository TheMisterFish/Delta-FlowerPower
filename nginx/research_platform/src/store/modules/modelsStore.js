import { GET_MODELS, ADD_MODEL, DELETE_MODEL, GET_MODEL, UPDATE_MODEL, ADD_MODEL_WEIGHTS, DELETE_MODEL_WEIGHTS } from "../mutationTypes";
import { STATUS, StoreResponse } from "../storeResponse";
import { addModel, addModelWeights, deleteModel, deleteModelWeights, getModel, getModels, updateModel } from "../../api/api"

export const modelsStore = {
    state: {
        models: [],
        status: "",
        message: ""
    },
    mutations: {
        [GET_MODELS](state, models) {
            state.models = models;
        },

        [GET_MODEL](state, model) {
            if (!state.models.find((m) => m._id === model._id)) {
                state.models.push(model);
            }
        },

        [ADD_MODEL](state, model) {
            state.models.push(model);
        },

        [DELETE_MODEL](state, _id) {
            state.models = state.models.filter(m => m._id != _id);
        },

        [UPDATE_MODEL](state, model) {
            state.models = state.models.filter(m => m._id !== model._id);
            state.models.push(model);
        },

        [ADD_MODEL_WEIGHTS](state, model) {
            state.models = state.models.filter(m => m._id !== model._id);
            state.models.push(model);
        },

        [DELETE_MODEL_WEIGHTS](state, model) {
            state.models = state.models.filter(m => m._id !== model._id);
            state.models.push(model);
        },
    },
    actions: {
        async getModels({ commit }) {
            try {
                const response = await getModels();
                commit(GET_MODELS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully fetched models", response.data)
            } catch (error) {
                return new StoreResponse(STATUS.SUCCESS, "Error fetching models")
            }
        },

        async getModel({ commit }, _id) {
            try {
                const response = await getModel(_id);
                commit(GET_MODEL, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully fetched model", response.data);
            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error fetching model");
            }
        },

        async addModel({ commit }, model) {
            try {
                const response = await addModel(model);
                commit(ADD_MODEL, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully added model", response.data);
            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error adding model");
            }
        },

        async deleteModel({ commit }, _id) {
            try {
                const response = await deleteModel(_id);
                commit(DELETE_MODEL, _id);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully deleted model", response.data);
            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error deleting model");
            }
        },

        async updateModel({ commit }, payload) {
            try {
                const response = await updateModel(payload._id, payload.model);
                commit(UPDATE_MODEL, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully updated model", response.data);
            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error updating model", error);
            }
        },

        async addModelWeights({ commit }, payload) {
            try {
                const response = await addModelWeights(payload._id, payload.weights);
                commit(ADD_MODEL_WEIGHTS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully updated model", response.data);
            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error updating model", error);
            }
        },

        async deleteModelWeights({ commit }, payload) {
            try {
                const response = await deleteModelWeights(payload._id, payload.weightsid);
                commit(DELETE_MODEL_WEIGHTS, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully updated model", response.data);

            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error updating model");
            }
        }
    },
    modules: {},
}