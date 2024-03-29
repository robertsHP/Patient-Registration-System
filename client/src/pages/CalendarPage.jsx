import React, { useState } from 'react';

import SearchComponent from '../components/SearchComponent.jsx';
import CalendarComponent from '../components/CalendarComponent.jsx';
import EventFormComponent from '../components/EventFormComponent.jsx';

import './CalendarPage.css'

function CalendarPage() {
    const [events, setEvents] = useState([
        { id: '0', title: 'Event 1', start: '2024-03-01', end: '2024-03-01' },
        { id: '1', title: 'Event 2', start: '2024-03-02', end: '2024-03-05' }
    ]);
    const [selEventID, setSelEventID] = useState(-1);
    
    return (
        <div className="row-wrapper">
            <div className="column-wrapper">
                <div className="calendar">
                    {/* <SearchComponent /> */}
                    <CalendarComponent 
                        events={events}
                        setEvents={setEvents}
                        selEventID={selEventID}
                        setSelEventID={setSelEventID}
                    />
                </div>
                <div className="event-form">
                    {/* //In JavaScript, the && operator returns the first falsy value if there is one.
                    //So if selectedEvent is null or undefined then nothing will be rendered. */}
                    {events[selEventID] && 
                        <EventFormComponent 
                            events={events}
                            setEvents={setEvents}
                            selEventID={selEventID}
                            setSelEventID={setSelEventID}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default CalendarPage