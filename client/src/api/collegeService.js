import axios from "axios";
const { API_URI } = require("../constants.json");
const COLLEGE_URI = `${API_URI}/api/colleges`;

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