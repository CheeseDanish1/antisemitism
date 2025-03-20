import axios from "axios";
const { API_URI } = require("../constants.json");
const RESOURCES_URI = `${API_URI}/api/resources`;

export function getResources() {
    return axios({
        url: `${RESOURCES_URI}`,
        method: "GET"
    })
}

export function addResource({title, content, resource_url}) {
    return axios({
        url: `${RESOURCES_URI}`,
        method: "POST",
        withCredentials: true,
        data: {title, content, resource_url}
    })
}

export function updateResource({id, title, content, resource_url}) {
    return axios({
        url: `${RESOURCES_URI}/${id}`,
        method: "PUT",
        withCredentials: true,
        data: {title, content, resource_url}
    })
}

export function deleteResource({id}) {
    return axios({
        url: `${RESOURCES_URI}/${id}`,
        method: "DELETE",
        withCredentials: true,
    })
}