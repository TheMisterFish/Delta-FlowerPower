import ModelsApi from "../../api/ModelsApi"
import { GET_MODELS } from "../mutationTypes";

const models_store = {
    state: {
        models: []
    },
    mutations: {
        [GET_MODELS](state, models) {
            state.models = models;
        }
    },
    actions: {
        async getModels({ commit }) {
            const r = await ModelsApi.getModels();
            console.log(r);
            commit(GET_MODELS);
        }
    },
    getters: {

    }
}

export default models_store