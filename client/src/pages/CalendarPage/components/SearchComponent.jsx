import React, { useState } from 'react';

// import '../../../global.css'
import './SearchComponent.css'

export default function SearchComponent (props) {
    const [term, setTerm] = useState('');

    const onInputChange = (event) => {
        setTerm(event.target.value);
    };

    // Filter the events based on the search term
    const filteredEvents = Object.keys(props.events).filter(key => 
        props.events[key].patientName.toLowerCase().includes(term.toLowerCase()) ||
        props.events[key].start.toLowerCase().includes(term.toLowerCase()) ||
        props.events[key].end.toLowerCase().includes(term.toLowerCase())
    );

    const onClickEvent = (eventId, event) => {
        props.calendarRef.current.getApi().gotoDate(event.start);

        var roomObj = props.getRoomWithNumber(event.room)

        props.setRoom(roomObj.id, roomObj);
        props.setRoomID(roomObj.id);
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
                        onClick={() => onClickEvent(key, props.events[key])} 
                        className="row-item"
                    >
                        {props.events[key].patientName+", "+props.events[key].start+", "+props.events[key].end}
                    </button>
                ))}
            </div>
        </div>
    );
}