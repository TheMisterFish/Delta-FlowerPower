import Axios from "axios";
import {
    IPC_MESSAGES,
    IPC_CHANNELS,
    DB_NAMES
} from "../constants";

const AIModelActions = {
    async saveModels(new_models) {
        var models = await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.FIND_IN_DB,
            data: {},
            database: DB_NAMES.MODELDB
        });
        if (models) {
            new_models.forEach(async model => {
                const found = models.find(x => x._id === model._id);
                if (!found) {
                    await window.electron.invoke(IPC_CHANNELS.DATABASE, {
                        message: IPC_MESSAGES.SAVE_IN_DB,
                        data: model,
                        database: DB_NAMES.MODELDB
                    });
                } else {
                    var update = false;
                    model.weights.forEach(async weight => {
                        const found_weight = found.weights.find(x => x._id === weight._id);
                        if (!found_weight) {
                            found.weights.push(weight)
                            update = true;
                        }
                    })
                    if (update) {
                        await window.electron.invoke(IPC_CHANNELS.DATABASE, {
                            message: IPC_MESSAGES.UPDATE_IN_DB,
                            to_update: {
                                _id: model._id
                            },
                            data: {
                                weights: found.weights
                            },
                            options: {},
                            database: DB_NAMES.MODELDB
                        });
                    }
                }
            });
        } else {
            new_models.forEach(async model => {
                await window.electron.invoke(IPC_CHANNELS.DATABASE, {
                    message: IPC_MESSAGES.SAVE_IN_DB,
                    data: model,
                    database: DB_NAMES.MODELDB
                });
            });
        }
    },
    async getModels() {
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.FIND_IN_DB,
            data: {},
            database: DB_NAMES.MODELDB
        });
    },
    async getModel(id) {
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.FIND_IN_DB,
            data: {
                _id: id
            },
            database: DB_NAMES.MODELDB
        });
    },
    async resetModels() {
        const models = await this.getModels();
        models.forEach(model => {
            model.weights.forEach(async weight => {
                if (weight.downloadPath) {
                    await window.electron.invoke(IPC_CHANNELS.REMOVE_WEIGHT, {
                        path: weight.downloadPath
                    });
                }
            })
        })
        return await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.RESET_DATABASE,
            data: {},
            database: DB_NAMES.MODELDB
        });
    },
    async downloadWeight(weight) {
        const filePath = await window.electron.invoke(IPC_CHANNELS.DOWNLOAD_WEIGHTS, {
            url: `${Axios.defaults.baseURL}/${weight.filePath.replace('public/', '')}`,
            modelName: weight.model
        });
        const model = await this.getModel(weight.model_id);
        const myweight = model[0].weights.find(x => x._id === weight.weight_id);
        myweight.downloadPath = filePath;
        await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.UPDATE_IN_DB,
            to_update: {
                _id: weight.model_id
            },
            data: model,
            options: {},
            database: DB_NAMES.MODELDB
        });

        // return filePath;
    },
    async removeWeight(weight) {
        await window.electron.invoke(IPC_CHANNELS.REMOVE_WEIGHT, {
            path: weight.downloadPath
        });
        const model = await this.getModel(weight.model_id);
        const myweight = model[0].weights.find(x => x._id === weight.weight_id);
        myweight.downloadPath = undefined;
        await window.electron.invoke(IPC_CHANNELS.DATABASE, {
            message: IPC_MESSAGES.UPDATE_IN_DB,
            to_update: {
                _id: weight.model_id
            },
            data: model,
            options: {},
            database: DB_NAMES.MODELDB
        });
    }
};

export default AIModelActions;