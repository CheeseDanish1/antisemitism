import axios from "axios";
import config from '../config/api'
const AUTH_URI = `${config.API_URI}/auth`;

export function registerUser({ username, email, password, role }) {
    return axios({
        url: `${AUTH_URI}/register`,
        method: "POST",
        withCredentials: true,
        data: { username, email, password, role }
    })
}

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