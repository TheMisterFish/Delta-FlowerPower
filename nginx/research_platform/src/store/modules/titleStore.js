export const titleStore = {
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