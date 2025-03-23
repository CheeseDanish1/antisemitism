import axios from "axios";
import config from '../config/api'
const COLLEGE_URI = `${config.API_URI}/api/colleges`;

export function getColleges() {
    return axios({
        url: `${COLLEGE_URI}`,
        method: "GET"
    })
}

export function getCollege({ id }) {
    return axios({
        url: `${COLLEGE_URI}/${id}`,
        method: "GET"
    })
}

export function createCollege({ name, description, location, website, ranking }) {
    return axios({
        url: `${COLLEGE_URI}`,
        method: "POST",
        data: { name, description, location, website, ranking },
        withCredentials: true
    })
}

export function updateCollege({ id, name, description, location, website, ranking }) {
    return axios({
        url: `${COLLEGE_URI}/${id}`,
        method: "PUT",
        data: { name, description, location, website, ranking },
        withCredentials: true
    })
}