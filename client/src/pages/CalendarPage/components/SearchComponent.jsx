import React, { useState } from 'react';

import { useCalendarContext } from '../contexts/CalendarContext.jsx';

// import '../../../global.css'
import './SearchComponent.css'

export default function SearchComponent () {
    const { 
        events,
        calendarRef,

        setRoom,
        setSelectedRoom,
        getRoom,
        getRoomWithNumber
    } = useCalendarContext();

    const [term, setTerm] = useState('');

    const onInputChange = (event) => {
        setTerm(event.target.value);
    };

    // Filter the events based on the search term
    const filteredEvents = Object.keys(events).filter(key => 
        events[key].patientName.toLowerCase().includes(term.toLowerCase()) ||
        events[key].start.toLowerCase().includes(term.toLowerCase()) ||
        events[key].end.toLowerCase().includes(term.toLowerCase())
    );

    const onClickEvent = (eventId, event) => {
        calendarRef.current.getApi().gotoDate(event.start);

        var roomObj = getRoomWithNumber(event.room)

        setRoom(roomObj.id, roomObj);
        setSelectedRoom(roomObj);
    };

    return (
        <div className="global-component">
            <input 
                type="text" 
                value={term} 
                onChange={onInputChange} 
                placeholder="Meklēt..."
            />
            <div className="row-container">
                {filteredEvents.map((key) => (
                    <button 
                        key={key} 
                        onClick={() => onClickEvent(key, events[key])} 
                        className="row-item"
                    >
                        {events[key].patientName+", "+events[key].start+", "+events[key].end}
                    </button>
                ))}
            </div>
        </div>
    );
}