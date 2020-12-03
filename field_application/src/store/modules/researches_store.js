import ResearchesApi from "../../api/ResearchesApi"
import { GET_RESEARCHES } from "../mutationTypes";

const researches_store = {
    state: {
        researches: []
    },
    mutations: {
        [GET_RESEARCHES](state, researches) {
            state.researches = researches;
        }
    },
    actions: {
        async getResearches({ commit }) {
            const result = await ResearchesApi.getResearches();
            commit(GET_RESEARCHES, result);
        }
    },
    getters: {

    }
}

export default researches_store