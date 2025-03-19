// /colleges/{id}
// Will have all incidents and all student interviews

import React from 'react'
import { useParams } from 'react-router-dom'

function IncidentDetails() {
    const { id } = useParams();

    return <p>IncidentDetails: {id}</p>
}

export default IncidentDetails;