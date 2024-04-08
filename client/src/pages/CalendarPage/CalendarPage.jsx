import React, { useState } from 'react';
import { Router, Route, Routes } from 'react-router-dom';

import usePageManagementHook from './hooks/usePageManagementHook.jsx';
import useEventManagementHook from './hooks/useEventManagementHook.jsx';

import PageSelectComponent from './components/PageSelectComponent.jsx';
import SearchComponent from './components/SearchComponent.jsx';
import MainViewPickerComponent from './components/MainViewPickerComponent.jsx';
import EventFormComponent from './components/EventFormComponent.jsx';

import './CalendarPage.css'

//Gultas
//Gultas 4. stāvs
//Pirts

export default function CalendarPage (props) {
    var pages = [
        { tableName: "beds", title: "Gultas" },
        { tableName: "beds4", title: "Gultas 4. stāvs" },
        { tableName: "sauna", title: "Pirts" }
    ];

    return (
        <>
            <PageSelectComponent 
                pages={pages}
                component={CalendarModule}
            />
        </>
    );
}

function CalendarModule ({tableName}) {
    // console.log(tableName);

    const { events, setEvents, eventID, setEventID, getEvent, setEvent } = useEventManagementHook(
        [
            { id: 0, title: 'Event 1', start: '2024-03-01', end: '2024-03-01' },
            { id: 1, title: 'Event 2', start: '2024-03-02', end: '2024-03-05' },
            { id: 2, title: 'aaaaaa', start: '2024-04-07', end: '2024-04-20' },
            { id: 3, title: 'bbbbbbb', start: '2024-04-28', end: '2024-04-30' },
            { id: 4, title: 'cccccc', start: '2024-04-01', end: '2024-04-08' }
        ], -1
    );

    return (
        <>
            <div className="flex-container">
                <div className="search">
                    <SearchComponent />
                </div>
                <div className="main-view-picker">
                    <MainViewPickerComponent 
                        events={events}
                        setEvents={setEvents}
                        eventID={eventID}
                        setEventID={setEventID}
                    />
                </div>
                <div className="event-form">
                    {/* //In JavaScript, the && operator returns the first falsy value if there is one.
                    //So if selectedEvent is null or undefined then nothing will be rendered. */}
                    {getEvent(eventID) && 
                        <EventFormComponent 
                            events={events}
                            setEvents={setEvents}
                            eventID={eventID}
                            getEvent={getEvent}
                            setEvent={setEvent}
                        />
                    }
                </div>
            </div>
        </>
    )
}