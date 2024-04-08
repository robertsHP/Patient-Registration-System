import React, { useState } from 'react';

import usePageManagementHook from './hooks/usePageManagementHook.jsx';
import useEventManagementHook from './hooks/useEventManagementHook.jsx';

import HeaderComponent from './components/HeaderComponent.jsx';
import SearchComponent from './components/SearchComponent.jsx';
import CalendarComponent from './components/CalendarComponent.jsx';
import EventFormComponent from './components/EventFormComponent.jsx';

import './CalendarPage.css'

export default function CalendarPage (props) {
    const { pages, pageID, setPageID } = usePageManagementHook(
        [
            { tableName: "beds", title: "Gultas" },
            { tableName: "beds4", title: "Gultas 4. stāvs" },
            { tableName: "sauna", title: "Pirts" }
        ], 0
    );
    const { events, setEvents, eventID, setEventID, getEventByID } = useEventManagementHook(
        [
            { id: 0, title: 'Event 1', start: '2024-03-01', end: '2024-03-01' },
            { id: 1, title: 'Event 2', start: '2024-03-02', end: '2024-03-05' }
        ], -1
    );

    return (
        <>
            <HeaderComponent 
                pages={pages}
                pageID={pageID}
                setPageID={setPageID}
            />

            <div className="flex-container">
                <div className="search">
                    <SearchComponent />
                </div>
                <div className="calendar">
                    <CalendarComponent 
                        events={events}
                        setEvents={setEvents}
                        eventID={eventID}
                        setEventID={setEventID}
                    />
                </div>
                <div className="event-form">
                    {/* //In JavaScript, the && operator returns the first falsy value if there is one.
                    //So if selectedEvent is null or undefined then nothing will be rendered. */}
                    {getEventByID(eventID) && 
                        <EventFormComponent 
                            events={events}
                            setEvents={setEvents}
                            eventID={eventID}
                            getEventByID={getEventByID}
                        />
                    }
                </div>
            </div>
        </>
    )
}