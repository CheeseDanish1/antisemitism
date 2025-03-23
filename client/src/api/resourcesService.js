import axios from "axios";
import config from '../config/api'
const RESOURCES_URI = `${config.API_URI}/api/resources`;

export function getResources() {
    return axios({
        url: `${RESOURCES_URI}`,
        method: "GET"
    })
}

export function addResource({ title, content, resource_url }) {
    return axios({
        url: `${RESOURCES_URI}`,
        method: "POST",
        withCredentials: true,
        data: { title, content, resource_url }
    })
}

export function updateResource({ id, title, content, resource_url }) {
    return axios({
        url: `${RESOURCES_URI}/${id}`,
        method: "PUT",
        withCredentials: true,
        data: { title, content, resource_url }
    })
}

export function deleteResource({ id }) {
    return axios({
        url: `${RESOURCES_URI}/${id}`,
        method: "DELETE",
        withCredentials: true,
    })
}