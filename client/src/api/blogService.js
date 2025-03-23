import axios from "axios";
import config from '../config/api'
const BLOG_URI = `${config.API_URI}/api/blog`;

export function getBlogs() {
    return axios({
        url: `${BLOG_URI}/all`,
        method: "GET",
        withCredentials: true,
    })
}

export function addBlog({ title, slug, content, author, status }) {
    return axios({
        url: `${BLOG_URI}`,
        method: "POST",
        withCredentials: true,
        data: { title, slug, content, author, status }
    })
}
export function getBlogDetails({ id }) {
    return axios({
        url: `${BLOG_URI}/${id}`,
        method: "GET"
    })
}

export function updateBlog({ id, title, slug, content, status }) {
    return axios({
        url: `${BLOG_URI}/${id}`,
        method: "PUT",
        withCredentials: true,
        data: { title, slug, content, status }
    })
}

export function deleteBlog({ id }) {
    return axios({
        url: `${BLOG_URI}/${id}`,
        method: "DELETE",
        withCredentials: true,
    })
}