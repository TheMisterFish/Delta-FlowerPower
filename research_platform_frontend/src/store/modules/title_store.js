export const title_store = {
    state: {
        title: ""
    },
    mutations: {
        setTitle(state, title) {
            state.title = title;
        }
    },
    actions: {
        setTitle({ commit }, title) {
            commit("setTitle", title);
        }
    }
}