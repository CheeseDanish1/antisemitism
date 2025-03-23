import axios from "axios";
import config from '../config/api'
const INTERVIEWS_URI = `${config.API_URI}/api/interviews`;

/**
 * Get all interviews with filtering, sorting, and pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Results per page
 * @param {string} [params.sort_by="published_at"] - Field to sort by
 * @param {string} [params.order="desc"] - Sort order (asc/desc)
 * @param {string} [params.college_id] - Filter by college ID
 * @param {string} [params.media_type] - Filter by media type
 * @param {number} [params.min_rating] - Minimum rating filter
 * @param {number} [params.max_rating] - Maximum rating filter
 * @param {string} [params.search] - Search text
 * @param {string} [params.from_date] - Start date filter (ISO format)
 * @param {string} [params.to_date] - End date filter (ISO format)
 * @returns {Promise} - Axios promise
 */
export function getInterviews(params = {}) {
    return axios({
        url: INTERVIEWS_URI,
        method: "GET",
        params
    });
}

/**
 * Create a new interview
 * @param {Object} data - Interview data
 * @param {string} data.college_id - College ID
 * @param {string} data.title - Interview title
 * @param {string} data.interviewee_name - Name of interviewee
 * @param {string} [data.interviewee_title] - Title of interviewee
 * @param {string} data.content - Interview content
 * @param {string} [data.media_type="text"] - Media type (text, video, audio)
 * @param {string} [data.media_url] - URL for media content
 * @param {number} [data.final_assessment] - Rating (0-5)
 * @param {Array} [data.questions=[]] - Array of question objects
 * @returns {Promise} - Axios promise
 */
export function createInterview(data) {
    return axios({
        url: INTERVIEWS_URI,
        method: "POST",
        data,
        withCredentials: true
    });
}

/**
 * Get a single interview by ID with its questions
 * @param {string} id - Interview ID
 * @returns {Promise} - Axios promise
 */
export function getInterviewById(id) {
    return axios({
        url: `${INTERVIEWS_URI}/${id}`,
        method: "GET"
    });
}

/**
 * Update an interview
 * @param {string} id - Interview ID
 * @param {Object} data - Updated interview data
 * @returns {Promise} - Axios promise
 */
export function updateInterview(id, data) {
    return axios({
        url: `${INTERVIEWS_URI}/${id}`,
        method: "PUT",
        data,
        withCredentials: true
    });
}

/**
 * Delete an interview
 * @param {string} id - Interview ID
 * @returns {Promise} - Axios promise
 */
export function deleteInterview(id) {
    return axios({
        url: `${INTERVIEWS_URI}/${id}`,
        method: "DELETE",
        withCredentials: true
    });
}

/**
 * Get all questions for an interview
 * @param {string} id - Interview ID
 * @returns {Promise} - Axios promise
 */
export function getInterviewQuestions(id) {
    return axios({
        url: `${INTERVIEWS_URI}/${id}/questions`,
        method: "GET"
    });
}

/**
 * Add new questions to an interview
 * @param {string} id - Interview ID
 * @param {Object} data - Questions data
 * @param {Array} data.questions - Array of question objects
 * @returns {Promise} - Axios promise
 */
export function addInterviewQuestions(id, data) {
    return axios({
        url: `${INTERVIEWS_URI}/${id}/questions`,
        method: "POST",
        data,
        withCredentials: true
    });
}

/**
 * Update a specific question
 * @param {string} interviewId - Interview ID
 * @param {string} questionId - Question ID
 * @param {Object} data - Updated question data
 * @returns {Promise} - Axios promise
 */
export function updateInterviewQuestion(interviewId, questionId, data) {
    return axios({
        url: `${INTERVIEWS_URI}/${interviewId}/questions/${questionId}`,
        method: "PUT",
        data,
        withCredentials: true
    });
}

/**
 * Delete a specific question
 * @param {string} interviewId - Interview ID
 * @param {string} questionId - Question ID
 * @returns {Promise} - Axios promise
 */
export function deleteInterviewQuestion(interviewId, questionId) {
    return axios({
        url: `${INTERVIEWS_URI}/${interviewId}/questions/${questionId}`,
        method: "DELETE",
        withCredentials: true
    });
}

/**
 * Reorder questions for an interview
 * @param {string} id - Interview ID
 * @param {Object} data - Questions reordering data
 * @param {Array} data.questions - Array of question objects with id and position
 * @returns {Promise} - Axios promise
 */
export function reorderInterviewQuestions(id, data) {
    return axios({
        url: `${INTERVIEWS_URI}/${id}/questions/reorder`,
        method: "PUT",
        data,
        withCredentials: true
    });
}

/**
 * Get all interviews for a specific college
 * @param {string} collegeId - College ID
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Results per page
 * @returns {Promise} - Axios promise
 */
export function getInterviewsByCollege(collegeId, params = {}) {
    return axios({
        url: `${INTERVIEWS_URI}/college/${collegeId}`,
        method: "GET",
        params
    });
}

/**
 * Get interview statistics
 * @returns {Promise} - Axios promise
 */
export function getInterviewStats() {
    return axios({
        url: `${INTERVIEWS_URI}/stats`,
        method: "GET"
    });
}

/**
 * Advanced search for interviews
 * @param {string} query - Search query
 * @returns {Promise} - Axios promise
 */
export function searchInterviews(query) {
    return axios({
        url: `${INTERVIEWS_URI}/search`,
        method: "GET",
        params: { query }
    });
}