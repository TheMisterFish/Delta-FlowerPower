import store from "../store";
import * as axios from "axios"

const WeightsApi = {
    getModels() {
        return axios
            .get("http://localhost:3000/aimodels")
            .then(response => response.data)
            .catch(err => {
                store.dispatch("api_response", {
                    err: err.response
                })
            })
    }
}

export default WeightsApi