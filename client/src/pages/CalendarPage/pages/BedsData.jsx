import React, { useState } from 'react';

import bedsForm from './data/bedsForm.jsx';
import unavailabilityForm from './data/unavailabilityForm.jsx';

import SearchComponent from '../components/CalendarComponent/SearchComponent.jsx';
import CalendarUIComponent from '../components/CalendarComponent/CalendarUIComponent.jsx';
import EventFormComponent from '../components/CalendarComponent/EventFormComponent.jsx';

import useEventManagementHook from '../hooks/useEventManagementHook.jsx';
import useEventModeHook from '../hooks/useEventManagementHook.jsx';
import useRoomManagementHook from '../hooks/useRoomManagementHook.jsx';

export default function BedsPage () {
    //IELĀDĒ DATUS
    ///
    //
    const { 
        events, setEvents, 
        eventID, setEventID, 
        getEvent, setEvent, 
        updateEvent, deleteEvent,
        selectedEvent, setSelectedEvent
    } = useEventManagementHook(
        [
            { id: 0, room: 201, patientName: 'aaaaaa', start: '2024-04-19', end: '2024-04-21' },
            { id: 1, room: 203, patientName: 'bbbbbbb', start: '2024-04-28', end: '2024-04-30' },
            { id: 2, room: 203, patientName: 'e', start: '2024-03-28', end: '2024-03-30' },
            { id: 3, room: 203, patientName: '------------', start: '2024-02-28', end: '2024-02-30' },
            { id: 4, room: 204, patientName: 'cccccc', start: '2024-04-01', end: '2024-04-08' }
        ], -1
    );
    ///
    
    const { 
        rooms, setRooms, 
        roomID, setRoomID, 
        getRoom, setRoom
    } = useRoomManagementHook(
        [
            { id: 0, num: 201, beds: [ 'lielā gulta', 'dīvāns' ] },
            { id: 1, num: 202, beds: [ 'lielā gulta', 'izv.dīv.' ] },
            { id: 2, num: 203, beds: [ '', '4 vienv.g.', '', '' ] },
        ], 0
    );

    const [disallowedDates, setDisallowedDates] = useState([
        { id: 0, room: 201, start: '2024-04-10', end: '2024-04-15' },
        { id: 1, room: 201, start: '2024-03-18', end: '2024-03-20' }
    ]);

    const [eventMode, setEventMode] = useState("add");
    const [calendarRef, setCalendarRef] = useState(React.createRef());

    return (
        <>
            <div className="flex-container">
                <div className="search">
                    <SearchComponent 
                        events={events}
                        calendarRef={calendarRef}
                    />
                </div>
                <div className="main-view-picker">
                    <CalendarUIComponent 
                        calendarRef={calendarRef}

                        disallowedDates={disallowedDates}
                        eventMode={eventMode}
                        roomID={roomID}
                        getRoom={getRoom}

                        events={events}
                        setEvents={setEvents}
                        eventID={eventID}
                        setEventID={setEventID}
                        getEvent={getEvent}
                        updateEvent={updateEvent}
                        setSelectedEvent={setSelectedEvent}
                    />
                </div>
                <div className="event-form">
                    {/* //In JavaScript, the && operator returns the first falsy value if there is one.
                    //So if selectedEvent is null or undefined then nothing will be rendered. */}
                    {getEvent(eventID) && 
                        <EventFormComponent 
                            events={events}
                            tags={bedsForm}
                            eventID={eventID}
                            setEventID={setEventID}
                            getEvent={getEvent}
                            setEvent={setEvent}
                            deleteEvent={deleteEvent}
                            selectedEvent={selectedEvent}
                            setSelectedEvent={setSelectedEvent}
                        />
                    }
                </div>
            </div>
        </>
    )
}