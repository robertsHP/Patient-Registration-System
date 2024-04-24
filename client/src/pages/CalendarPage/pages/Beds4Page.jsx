import React, { useState, useEffect } from 'react';

import bedsForm from './data/bedsForm.jsx';

import SearchComponent from '../components/SearchComponent.jsx';
import CalendarUIComponent from '../components/CalendarComponent/CalendarUIComponent.jsx';
import EventFormComponent from '../components/EventFormComponent/EventFormComponent.jsx';

import CalendarOptions from '../components/CalendarComponent/CalendarOptions.jsx';

import { CalendarProvider } from '../contexts/CalendarContext.jsx';

import './Page.css'

export default function Beds4Page () {
    var events = [
        { id: 0, room: 401, patientName: 'aaaaaa', start: '2024-03-28', end: '2024-04-04' },
        { id: 1, room: 403, patientName: 'bbbbbbb', start: '2024-01-20', end: '2024-01-30' },
        { id: 2, room: 403, patientName: 'e', start: '2024-04-15', end: '2024-04-19' }
    ];
    var rooms = [
        { id: 0, num: 401, beds: [ 'lielā gulta', 'dīvāns' ] },
        { id: 1, num: 402, beds: [ 'lielā gulta', 'izv.dīv.' ] },
        { id: 2, num: 403, beds: [ '', '4 vienv.g.', '', '' ] },
        { id: 3, num: 404, beds: [ 'gulta', '', '', 'gulta' ] },
    ];
    var disallowedDates = [
        { id: 0, room: 401, description:"REMONTS", start: '2024-04-10', end: '2024-04-15' },
        { id: 1, room: 401, description:"REMONTS", start: '2024-03-18', end: '2024-03-20' }
    ];

    var initialStates = {
        events: events,
        rooms: rooms,
        disallowedDates: disallowedDates
    };

    return (
        <CalendarProvider initialStates={initialStates}>
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
        </CalendarProvider>
    )
}