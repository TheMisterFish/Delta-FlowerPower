import {
    IPC_MESSAGES,
    IPC_CHANNELS,
    DB_NAMES
} from "../constants";

const LocalDatabaseActions = {
    async saveLocalResearch(research) {
        const clone = JSON.parse(JSON.stringify(research));
        await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.SAVE_IN_DB,
            data: clone,
            database: DB_NAMES.LOCAL_RESEARCHDB
        });
    },
    async getLocalResearches() {
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.FIND_IN_DB,
            data: {},
            database: DB_NAMES.LOCAL_RESEARCHDB
        });
    },
    async resetLocalResearches() {
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.RESET_DATABASE,
            data: {},
            database: DB_NAMES.LOCAL_RESEARCHDB
        });
    },
};

export default LocalDatabaseActions;