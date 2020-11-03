export const snackbar_store = {
    state: {
        message: "",
    },
    mutations: {
        showSnackbar(state, message) {
            state.message = message;
        },
        hideSnackbar() {}
    },
    actions: {
        showSnackbar({ commit }, message) {
            commit("showSnackbar", message);
        },
        hideSnackbar({ commit }) {
            commit("hideSnackbar");
        }
    }
}