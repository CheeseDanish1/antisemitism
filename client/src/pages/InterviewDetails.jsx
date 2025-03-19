// /colleges/{id}
// Will have all incidents and all student interviews

import React from 'react'
import { useParams } from 'react-router-dom'

function InterviewDetails() {
    const { id } = useParams();

    return <p>InterviewDetails: {id}</p>
}

export default InterviewDetails;