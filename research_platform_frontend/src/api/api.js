import Axios from 'axios';

export async function getAreas() {
    return Axios({
        url: "http://localhost:7080/locations",
        method: "GET",
    })
}

export async function getArea(_id) {
    return Axios({
        url: `http://localhost:7080/locations/${_id}`,
        method: "GET"
    })
}

export async function addArea(area) {
    return Axios({
        url: "http://localhost:7080/locations",
        method: "POST",
        data: area
    })
}

export async function deleteArea(_id) {
    return Axios({
        url: `http://localhost:7080/locations/${_id}`,
        method: "DELETE",
    })
}

export async function updateArea(_id, area) {
    return Axios({
        url: `http://localhost:7080/locations/${_id}`,
        data: area,
        method: "PUT"
    })
}