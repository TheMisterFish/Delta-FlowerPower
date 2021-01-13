import {
    IPC_MESSAGES,
    IPC_CHANNELS,
    DB_NAMES
} from "../constants";

const SessionActions = {
    async saveSession(session) {
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.SAVE_IN_DB,
            data: JSON.parse(JSON.stringify(session)),
            database: DB_NAMES.SESSIONSDB
        });
    },
    async getSessions() {
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.FIND_IN_DB,
            data: {},
            database: DB_NAMES.SESSIONSDB
        });
    },

    async updateSession(session) {
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.UPDATE_IN_DB,
            to_update: {
                _id: session._id
            },
            data: session,
            options: { returnUpdatedDocs: true },
            database: DB_NAMES.SESSIONSDB
        })
    },

    async resetLocalSessions() {
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.RESET_DATABASE,
            data: {},
            database: DB_NAMES.SESSIONSDB
        });
    },
};

export default SessionActions;