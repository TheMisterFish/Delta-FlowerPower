import Axios from 'axios';

//authentication_store
export function login(user) {
    return Axios({
        url: "http://localhost:7080/auth/login",
        method: "POST",
        data: user
    })
}

//users_store
export function getUsers() {
    return Axios({
        url: "http://localhost:7080/users",
        method: "GET"
    })
}

export function addUser(user) {
    return Axios({
        url: "http://localhost:7080/users",
        method: "POST",
        data: user
    })
}
//researches_store
export function getResearches() {
    return Axios({
        url: "http://localhost:7080/researches",
        method: "GET",
    })
}

export function addResearch(research) {
    return Axios({
        url: "http://localhost:7080/researches",
        method: "POST",
        data: research
    })
}

export function getResearch(_id) {
    return Axios({
        url: `http://localhost:7080/researches/${_id}`,
        method: "GET"
    })
}

//areas_store
export function getAreas() {
    return Axios({
        url: "http://localhost:7080/locations",
        method: "GET",
    })
}

export function getArea(_id) {
    return Axios({
        url: `http://localhost:7080/locations/${_id}`,
        method: "GET"
    })
}

export function addArea(area) {
    return Axios({
        url: "http://localhost:7080/locations",
        method: "POST",
        data: area
    })
}

export function deleteArea(_id) {
    return Axios({
        url: `http://localhost:7080/locations/${_id}`,
        method: "DELETE",
    })
}

export function updateArea(_id, area) {
    return Axios({
        url: `http://localhost:7080/locations/${_id}`,
        data: area,
        method: "PUT"
    })
}

//aimodels_Store
export function getModels() {
    return Axios({
        url: "http://localhost:7080/aimodels",
        method: "GET",
    })
}

export function getModel(_id) {
    return Axios({
        url: `http://localhost:7080/aimodels/${_id}`,
        method: "GET"
    })
}

export function addModel(area) {
    return Axios({
        url: "http://localhost:7080/aimodels",
        method: "POST",
        data: area
    })
}

export function deleteModel(_id) {
    return Axios({
        url: `http://localhost:7080/aimodels/${_id}`,
        method: "DELETE",
    })
}

export function updateModel(_id, area) {
    return Axios({
        url: `http://localhost:7080/aimodels/${_id}`,
        data: area,
        method: "PUT"
    })
}

export function addModelWeights(_id, weights) {
    return Axios({
        url: `http://localhost:7080/aimodels/${_id}/weights`,
        data: weights,
        method: "POST"
    })
}

export function deleteModelWeights(_id, weightsid) {
    return Axios({
        url: `http://localhost:7080/aimodels/${_id}/weights/${weightsid}`,
        method: "DELETE"
    })
}