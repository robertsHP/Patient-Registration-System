import React, { useState } from 'react';
import { Router, Route, Routes } from 'react-router-dom';

import bedsData from './data/bedsData.jsx';

import HeaderSelectComponent from './components/HeaderSelectComponent.jsx';
import EventFormComponent from './components/EventFormComponent.jsx';

import useEventManagementHook from './hooks/useEventManagementHook.jsx';

import './CalendarPage.css'

export default function CalendarPage () {
    function Module ({pageData}) {
        //IELĀDĒ DATUS
        ///
        //
        const { 
            events, 
            setEvents, 
            eventID, 
            setEventID, 
            getEvent, 
            setEvent 
        } = useEventManagementHook(
            [
                { id: 0, patientName: 'aaaaaa', start: '2024-04-07', end: '2024-04-20' },
                { id: 1, patientName: 'bbbbbbb', start: '2024-04-28', end: '2024-04-30' },
                { id: 2, patientName: 'cccccc', start: '2024-04-01', end: '2024-04-08' }
            ], 0
        );
        ///

        return (
            <>
                <div className="flex-container">
                    <div className="search">
                        {/* <SearchComponent 
                            events={events}
                        /> */}
                    </div>
                    <div className="main-view-picker">
                        <CalendarComponent 
                            events={events}
                            setEvents={setEvents}
                            eventID={eventID}
                            getEvent={getEvent}
                            setEventID={setEventID}
                        />
                    </div>
                    <div className="event-form">
                        {/* //In JavaScript, the && operator returns the first falsy value if there is one.
                        //So if selectedEvent is null or undefined then nothing will be rendered. */}
                        {getEvent(eventID) && 
                            <EventFormComponent 
                                pageData={pageData}
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

    var pageData = [
        bedsData
    ];

    return (
        <>
            <HeaderSelectComponent 
                pageData={pageData}
                component={Module}
            />
        </>
    );
}



// const [value, setValue] = useState('');

// const handleChange = (event) => {
//     setValue(event.target.value);
// };

// const TagComponent = bedsData.title.tag;

// return (
//     <>
//         <TagComponent value={value} onChange={handleChange} />
//     </>
// );