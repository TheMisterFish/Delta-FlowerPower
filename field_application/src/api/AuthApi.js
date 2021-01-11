import store from "../store";
import * as axios from "axios"

const AuthApi = {
    login(user) {
        return axios
            .post("/auth/login", user)
            .then(response => response.data)
            .catch(err => {
                store.dispatch("api_response", {
                    err: err.response
                })
            })
    }
}

export default AuthApi