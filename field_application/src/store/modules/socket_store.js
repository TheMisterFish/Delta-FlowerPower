import { SOCKET_CONNECT, SOCKET_CONNECT_ERROR, SOCKET_CONNECT_SUCCESS, SOCKET_DISCONNECT, SOCKET_ON_SEND_MESSAGE, SOCKET_SEND_MESSAGE } from "../mutationTypes";

export const socket_store = {
    state: {
        websocket: null,
        connected: false,
        status: '',
        messages: [],
        messageCount: 0
    },
    mutations: {
        [SOCKET_CONNECT](state) {
            state.status = 'loading';
        },
        [SOCKET_CONNECT_SUCCESS](state, websocket) {
            state.connected = true;
            state.websocket = websocket;
            state.status = 'success'
        },
        [SOCKET_CONNECT_ERROR](state) {
            state.connected = false;
            state.status = 'error';
        },
        [SOCKET_DISCONNECT](state) {
            state.websocket.close();
            state.status = 'success';
        },
        [SOCKET_ON_SEND_MESSAGE](state, message) {
            state.messages.push(message);
            state.messageCount += 1;
        },
        [SOCKET_SEND_MESSAGE](state, message) {
            state.websocket.send(message);
            state.status = 'success';
        }
    },
    actions: {
        connectWebSocket({ commit }) {
            commit(SOCKET_CONNECT);
            try {
                const websocket = new WebSocket("ws://localhost:9000");
                commit(SOCKET_CONNECT_SUCCESS, websocket);
                return websocket;
            } catch (error) {
                commit(SOCKET_CONNECT_ERROR);
            }
        },
        disconnectWebSocket({ commit }) {
            commit(SOCKET_DISCONNECT);
        },
        onWebSocketMessage({ commit }, message) {
            commit(SOCKET_ON_SEND_MESSAGE, message);
        },
        sendWebSocketMessage({ commit }, message) {
            commit(SOCKET_SEND_MESSAGE, message);
        }
    }
}