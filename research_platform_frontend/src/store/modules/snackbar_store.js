export const snackbar_store = {
    state: {
        message: "",
        visible: false,
    },
    mutations: {
        showSnackbar(state, message) {
            state.message = message;
            state.visible = true;
        },
        hideSnackbar(state) {
            state.visible = false;
        }
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