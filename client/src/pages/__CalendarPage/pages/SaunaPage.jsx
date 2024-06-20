import React, { useState, useEffect } from 'react';

import bedsForm from './data/bedsForm.jsx';

import SearchComponent from '../components/SearchComponent.jsx';
import CalendarUIComponent from '../components/CalendarComponent/CalendarUIComponent.jsx';
import EventFormComponent from '../components/EventFormComponent/EventFormComponent.jsx';

import CalendarOptions from '../components/CalendarComponent/CalendarOptions.jsx';

import { CalendarProvider } from '../contexts/CalendarContext.jsx';

import './Page.css'

export default function SaunaPage () {
    var events = [
        { id: 0, patientName: 'Laura', start: '2024-04-19', end: '2024-04-21' },
        { id: 1, patientName: 'Beāte', start: '2024-04-28', end: '2024-04-30' },
        { id: 2, patientName: 'Natālija', start: '2024-03-28', end: '2024-03-30' },
        { id: 3, patientName: 'Andris', start: '2024-02-28', end: '2024-02-30' },
        { id: 4, patientName: 'Vladislavs', start: '2024-04-01', end: '2024-04-08' }
    ];
    var disallowedDates = [
        { id: 0, description:"REMONTS", start: '2024-04-10', end: '2024-04-15' },
        { id: 1, description:"REMONTS", start: '2024-03-18', end: '2024-03-20' }
    ];

    var initialStates = {
        events: events,
        rooms: null,
        disallowedDates: disallowedDates
    };

    return (
        <>
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
        </>
    )
}