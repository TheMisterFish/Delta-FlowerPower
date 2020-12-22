import { addResearch, getResearch, getResearches } from "../../api/api";
import { ADD_RESEARCH, GET_RESEARCH, GET_RESEARCHES } from "../mutationTypes";
import { STATUS, StoreResponse } from "../storeResponse";

export const researchesStore = {
    state: {
        researches: [],
    },
    mutations: {
        [GET_RESEARCHES](state, researches) {
            state.researches = researches;
        },
        [ADD_RESEARCH](state, research) {
            state.researches.push(research);
        },
        [GET_RESEARCH](state, research) {
            if (!state.researches.find((r) => r._id === research._id)) {
                state.researches.push(research);
            }
        },
    },
    actions: {
        async getResearches({ commit }) {
            try {
                const response = await getResearches();
                commit(GET_RESEARCHES, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully fetched researches", response.data);
            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error fetching researches", error);
            }
        },

        async addResearch({ commit }, research) {
            try {
                const response = await addResearch(research);
                commit(ADD_RESEARCH, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully added research", response.data);
            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error adding research", error);
            }
        },

        async getResearch({ commit }, _id) {
            try {
                const response = await getResearch(_id);
                commit(GET_RESEARCH, response.data);
                return new StoreResponse(STATUS.SUCCESS, "Succesfully added research", response.data);
            } catch (error) {
                return new StoreResponse(STATUS.ERROR, "Error getting research", error);
            }
        }
    }
}