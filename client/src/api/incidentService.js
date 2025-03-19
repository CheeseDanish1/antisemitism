import axios from "axios";

const { API_URI } = require("../../constants.json");
const INCIDCENTS_URI = `${API_URI}/incidents`

export function getPetitionStats() {
    return axios({
        url: `${PETITION_URI}/stats`,
        method: "GET"
    })
}

export function signPetition({signer_name, high_school_name, email, graduation_year, reason, college_ids}) {
    return axios({
        url: `${PETITION_URI}/sign`,
        method: "POST",
        data: {signer_name, high_school_name, email, graduation_year, reason, college_ids}
    })
}