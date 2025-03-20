import axios from "axios";
const { API_URI } = require("../constants.json");
const AUTH_URI = `${API_URI}/auth`;

export function login({ email, password }) {
    return axios({
        url: `${AUTH_URI}/login`,
        method: "POST",
        data: { email, password },
        withCredentials: true
    });
}

export function logout() {
    return axios({
        url: `${AUTH_URI}/logout`,
        method: "POST",
        withCredentials: true
    });
}

export function getUser() {
    return axios({
        url: `${AUTH_URI}/me`,
        method: "GET",
        withCredentials: true
    });
}

export function refreshToken() {
    return axios({
        url: `${AUTH_URI}/refresh`,
        method: "POST",
        withCredentials: true
    });
}