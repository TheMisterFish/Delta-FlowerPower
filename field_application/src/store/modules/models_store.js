import WeightsApi from "../../api/WeightsApi"
import {
    GET_MODELS
} from "../mutationTypes";

const models_store = {
    state: {
        models: [
            "YoloV5",
            "YoloV3"
        ]
    },
    mutations: {
        [GET_MODELS](state, models) {
            state.models = models;
        }
    },
    actions: {
        async getModels({
            commit
        }) {
            const result = await WeightsApi.getModels();
            commit(GET_MODELS, result);
        }
    },
    getters: {

    }
}

export default models_store