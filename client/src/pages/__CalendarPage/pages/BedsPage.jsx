import React, { useState, useEffect } from 'react';

import bedsForm from './data/bedsForm.jsx';

import SearchComponent from '../components/SearchComponent.jsx';
import CalendarUIComponent from '../components/CalendarComponent/CalendarUIComponent.jsx';
import EventFormComponent from '../components/EventFormComponent/EventFormComponent.jsx';

import CalendarOptions from '../components/CalendarComponent/CalendarOptions.jsx';

import { CalendarProvider } from '../contexts/CalendarContext.jsx';

import './Page.css'

export default function BedsPage () {
    var events = [
        { id: 0, room: 201, patientName: 'Jānis', start: '2024-04-19', end: '2024-04-21' },
        { id: 1, room: 203, patientName: 'Evelīna', start: '2024-04-17', end: '2024-04-19' },
        { id: 2, room: 203, patientName: 'Andris', start: '2024-03-28', end: '2024-03-30' },
        { id: 3, room: 203, patientName: 'Jānis', start: '2024-02-28', end: '2024-02-30' },
        { id: 4, room: 204, patientName: 'Katrīna', start: '2024-04-01', end: '2024-04-08' }
    ];
    var rooms = [
        { id: 0, num: 201, beds: [ 'lielā gulta', 'dīvāns' ] },
        { id: 1, num: 202, beds: [ 'lielā gulta', 'izv.dīv.' ] },
        { id: 2, num: 203, beds: [ '', '4 vienv.g.', '', '' ] },
        { id: 3, num: 204, beds: [ 'gulta', '', '', 'gulta' ] },
    ];
    var disallowedDates = [
        { id: 0, room: 201, description:"REMONTS", start: '2024-04-10', end: '2024-04-15' },
        { id: 1, room: 201, description:"REMONTS", start: '2024-03-18', end: '2024-03-20' }
    ];

    var initialStates = {
        events: events,
        rooms: rooms,
        disallowedDates: disallowedDates
    };

    return (
        <>
            {/* <CalendarProvider initialStates={initialStates}>
                <div className="flex-container">
                    <div className="search">
                        <SearchComponent />
                    </div>
                    <div className="calendar-view">
                        <CalendarOptions />
                        <CalendarUIComponent />
                    </div>
                    <div className="event-form">
                        <EventFormComponent formTags={bedsForm} />
                    </div>
                </div>
            </CalendarProvider> */}
        </>
    )
}