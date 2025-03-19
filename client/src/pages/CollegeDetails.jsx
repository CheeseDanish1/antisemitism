// /colleges/{id}
// Will have all incidents and all student interviews

import React from 'react'
import { useParams } from 'react-router-dom'

function CollegeDetails() {
    const { id } = useParams();

    return <p>CollegeDetails: {id}</p>
}

export default CollegeDetails;