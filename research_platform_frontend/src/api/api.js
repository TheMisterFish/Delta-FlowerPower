import Axios from 'axios';

export async function getAreas() {
    return Axios({
        url: "http://localhost:7080/locations",
        method: "GET",
    })
}