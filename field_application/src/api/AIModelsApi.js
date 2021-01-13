import store from "../store";
import * as axios from "axios"

const AIModelsApi = {
    getModels() {
        return axios
            .get("/aimodels")
            .then(response => response.data)
            .catch(err => {
                store.dispatch("api_response", {
                    err: err.response
                })
            })
    }
}

export default AIModelsApi