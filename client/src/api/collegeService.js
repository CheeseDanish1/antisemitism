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

export function createCollege(collegeData) {
    const formData = new FormData();
    const bannerFile = collegeData.banner;

    for (const key in collegeData) {
        if (key !== 'banner') formData.append(key, collegeData[key]);
    }

    if (bannerFile) formData.append('banner', bannerFile);

    return axios({
        url: `${COLLEGE_URI}`,
        method: "POST",
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
}

export function updateCollege(id, collegeData, bannerFile) {
    const formData = new FormData();

    for (const key in collegeData) formData.append(key, collegeData[key]);


    if (bannerFile) {
        formData.append('banner', bannerFile);
    }

    return axios({
        url: `${COLLEGE_URI}/${id}`,
        method: "PUT",
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
    });
}

export function deleteCollegeBanner(collegeId) {
    return axios({
        url: `${COLLEGE_URI}/${collegeId}/banner`,
        method: "DELETE",
        withCredentials: true
    });
}

export function deleteCollege(id) {
    return axios({
        url: `${COLLEGE_URI}/${id}`,
        method: "DELETE",
        withCredentials: true
    });
}