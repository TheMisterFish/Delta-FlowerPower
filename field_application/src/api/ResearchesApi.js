import store from "../store";
import * as axios from "axios"

const ResearchesApi = {
    getResearches() {
        return axios
            .get("http://localhost:3000/sessions")
            .then(response => response.data)
            .catch(err => {
                store.dispatch("api_response", {
                    err: err.response
                })
            })
    }
}

export default ResearchesApi