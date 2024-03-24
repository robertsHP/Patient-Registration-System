import React from 'react';

import CalendarComponent from '../components/CalendarComponent.jsx';
import EventForm from '../components/EventForm.jsx';

import './CalendarPage.css'

function CalendarPage() {
    return (
        <div className="row-wrapper">
            <div className="column-wrapper">
                <div className="calendar"><CalendarComponent /></div>
                <div className="event-form"><EventForm /></div>
            </div>
        </div>
    )
}

export default CalendarPage