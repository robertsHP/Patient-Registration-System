import React from 'react';

import './EventInputForm.css';

export default function EventInputForm ({ event, onClose }) {

    console.log(event);

    return (
        <div className="form-container">
            <div className="modal-content">
                {/* <span className="close" onClick={onClose}>&times;</span>
                <h2>Event Details</h2>
                <p><strong>Patient Name:</strong> {event.patient ? event.patient.pat_name : 'N/A'}</p>
                <p><strong>Start Date:</strong> {event.begin_date.toString()}</p>
                <p><strong>End Date:</strong> {event.end_date.toString()}</p> */}
                <h1>WORKERINOOOOO</h1>
            </div>
        </div>
    );
}