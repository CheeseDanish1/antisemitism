import axios from "axios";
const { API_URI } = require("../constants.json");
const INCIDENTS_URI = `${API_URI}/api/incidents`;

/**
 * Get all incidents with optional filtering
 * @param {Object} options - Filter options
 * @param {string} [options.status] - Filter by status ('pending', 'verified', 'resolved')
 * @param {number} [options.severity] - Filter by severity (1-5)
 * @param {string} [options.college_id] - Filter by college ID
 * @param {string} [options.start_date] - Filter by start date (YYYY-MM-DD)
 * @param {string} [options.end_date] - Filter by end date (YYYY-MM-DD)
 * @param {number} [options.limit] - Limit number of results
 * @param {number} [options.offset] - Offset for pagination
 * @returns {Promise} Axios response with incidents data
 */
export function getIncidents(options = {}) {
    return axios({
        url: INCIDENTS_URI,
        method: "GET",
        params: options
    });
}

/**
 * Get a specific incident by ID with its evidence
 * @param {string} id - Incident ID
 * @returns {Promise} Axios response with incident data
 */
export function getIncidentById(id) {
    return axios({
        url: `${INCIDENTS_URI}/${id}`,
        method: "GET"
    });
}

/**
 * Get all incidents for a specific college
 * @param {string} collegeId - College ID
 * @returns {Promise} Axios response with college incidents data
 */
export function getCollegeIncidents(collegeId) {
    return axios({
        url: `${INCIDENTS_URI}/college/${collegeId}`,
        method: "GET"
    });
}

/**
 * Create a new incident
 * @param {Object} incidentData - Incident data
 * @param {string} incidentData.title - Incident title
 * @param {string} incidentData.description - Incident description
 * @param {string} incidentData.college_id - College ID
 * @param {string} incidentData.incident_date - Date of incident (YYYY-MM-DD)
 * @param {number} incidentData.severity - Severity level (1-5)
 * @param {string} incidentData.location - Specific location on campus
 * @param {string} [incidentData.media_url] - URL to media file
 * @param {string} [incidentData.reported_by] - Name of reporter (can be anonymous)
 * @param {string} [incidentData.status] - Status ('pending', 'verified', 'resolved')
 * @returns {Promise} Axios response with creation confirmation
 */
export function createIncident(incidentData) {
    return axios({
        url: INCIDENTS_URI,
        method: "POST",
        data: incidentData,
        withCredentials: true
    });
}

/**
 * Update an existing incident
 * @param {string} id - Incident ID
 * @param {Object} incidentData - Updated incident data
 * @returns {Promise} Axios response with update confirmation
 */
export function updateIncident(id, incidentData) {
    return axios({
        url: `${INCIDENTS_URI}/${id}`,
        method: "PUT",
        data: incidentData,
        withCredentials: true
    });
}

/**
 * Delete an incident
 * @param {string} id - Incident ID
 * @returns {Promise} Axios response with deletion confirmation
 */
export function deleteIncident({ id }) {
    return axios({
        url: `${INCIDENTS_URI}/${id}`,
        method: "DELETE",
        withCredentials: true
    });
}

/**
 * Update just the status of an incident
 * @param {string} id - Incident ID
 * @param {string} status - New status ('pending', 'verified', 'resolved')
 * @returns {Promise} Axios response with status update confirmation
 */
export function updateIncidentStatus({ id, status }) {
    return axios({
        url: `${INCIDENTS_URI}/${id}/status`,
        method: "PATCH",
        data: { status },
        withCredentials: true
    });
}

/**
 * Get all evidence for an incident
 * @param {string} id - Incident ID
 * @returns {Promise} Axios response with evidence data
 */
export function getIncidentEvidence({ id }) {
    return axios({
        url: `${INCIDENTS_URI}/${id}/evidence`,
        method: "GET"
    });
}

/**
 * Add evidence to an incident
 * @param {string} id - Incident ID
 * @param {Object} evidenceData - Evidence data
 * @param {string} evidenceData.evidence_url - URL to evidence file
 * @param {string} [evidenceData.description] - Description of the evidence
 * @returns {Promise} Axios response with evidence creation confirmation
 */
export function addIncidentEvidence({ incidentId, evidenceData }) {
    return axios({
        url: `${INCIDENTS_URI}/${incidentId}/evidence`,
        method: "POST",
        data: evidenceData,
        withCredentials: true
    });
}

/**
 * Delete a specific piece of evidence
 * @param {string} evidenceId - Evidence ID
 * @returns {Promise} Axios response with evidence deletion confirmation
 */
export function deleteEvidence({ evidenceId }) {
    return axios({
        url: `${INCIDENTS_URI}/evidence/${evidenceId}`,
        method: "DELETE",
        withCredentials: true
    });
}

/**
 * Get summary statistics for incidents (admin dashboard)
 * @returns {Promise} Axios response with statistics data
 */
export function getIncidentStats() {
    return axios({
        url: `${INCIDENTS_URI}/stats/summary`,
        method: "GET",
        withCredentials: true
    });
}