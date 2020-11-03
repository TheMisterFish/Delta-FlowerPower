import jwt_decode from "jwt-decode";

export function isAuthenticated() {
    try {
        const token = localStorage.getItem("token");
        const expirationTime = jwt_decode(token).exp;
        const currentTime = new Date().getTime() / 1000;

        if (!token || currentTime > expirationTime) {
            return false;
        }
    } catch (error) {
        return false;
    }


    return true;
}