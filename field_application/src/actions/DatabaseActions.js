import {
    IPC_MESSAGES,
    IPC_CHANNELS,
    DB_NAMES
} from "../constants";
import {
    IpcMessage
} from "../IpcMessage";

const DatabaseActions = {
    async saveResearches(new_researches) {
        var researches = await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.FIND_IN_DB,
            data: {},
            database: DB_NAMES.RESEARCHDB
        });
        console.log(researches);
        if(researches){
            new_researches.forEach(async research => {
                let found = researches.find(x => x._id === research._id);
                if (!found)
                    await window.electron.invoke(IPC_CHANNELS.DATABASE, {
                        message: IPC_MESSAGES.SAVE_IN_DB,
                        data: research,
                        database: DB_NAMES.RESEARCHDB
                    });
            });
        } else {
            new_researches.forEach(async research => {
                await window.electron.invoke(IPC_CHANNELS.DATABASE, {
                    message: IPC_MESSAGES.SAVE_IN_DB,
                    data: research,
                    database: DB_NAMES.RESEARCHDB
                });
            });
        }
    },

    async getResearches(){
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.FIND_IN_DB,
            data: {},
            database: DB_NAMES.RESEARCHDB
        });
    },
    async removeResearch(_id){
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.REMOVE_IN_DATABASE,
            data: {_id: _id},
            database: DB_NAMES.RESEARCHDB
        });
    }
};

export default DatabaseActions;