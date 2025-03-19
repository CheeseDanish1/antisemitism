import axios from "axios";

const { API_URI } = require("../../constants.json");
const PETITION_URI = `${API_URI}/petition`

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