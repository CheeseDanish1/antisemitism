import axios from "axios";
const { API_URI } = require("../constants.json");
const INTERVIEW_URI = `${API_URI}/api/interviews`;

export function getInterviews() {
    return axios({
        url: `${INTERVIEW_URI}`,
        method: "GET"
    })
}

export function getInterviewDetials({ id }) {
    return axios({
        url: `${INTERVIEW_URI}/${id}`,
        method: "GET",
    })
}

export function addInterview({ college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment}) {
    return axios({
        url: `${INTERVIEW_URI}`,
        method: "POST",
        withCredentials: true,
        data: { college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment}
    }) 
}

export function updateInterview({id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment}) {
    return axios({
        url: `${INTERVIEW_URI}/${id}`,
        method: "PUT",
        withCredentials: true,
        data: { college_id, title, interviewee_name, interviewee_title, content, media_type, media_url, final_assessment}
    })
}

export function deleteInterview({id}) {
    return axios({
        url: `${INTERVIEW_URI}/${id}`,
        method: "DELETE",
        withCredentials: true,
        })
}