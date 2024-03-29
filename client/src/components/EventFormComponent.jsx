import React, { useState, useEffect } from 'react';

import './EventFormComponent.css'

function EventFormComponent ({ events, setEvents, selEventID, setSelEventID }) {
    const [formState, setFormState] = useState({
        id: '',
        title: '',
        start: '',
        end: '',
        room: '',
        bedName: '',
        description: '',
        patientName: '',
        doctorName: '',
        hotelStayDate: ''
    });

    // Update formState when event prop changes
    useEffect(() => {
        setFormState({
            id: events[selEventID].id || '',
            title: events[selEventID].title || '',
            start: events[selEventID].start || '',
            end: events[selEventID].end || '',
            room: events[selEventID].room || '',
            bedName: events[selEventID].bedName || '',
            description: events[selEventID].description || '',
            patientName: events[selEventID].patientName || '',
            doctorName: events[selEventID].doctorName || '',
            hotelStayDate: events[selEventID].hotelStayDate || ''
        });
    }, [events[selEventID]]);
    
    const handleInputUpdate = (event) => {
        console.log("handleInputUpdate");

        const updatedEvent = {
            ...formState,
            [event.target.name]: event.target.value
        };

        // If the start date is after the end date, swap them
        if (updatedEvent.start > updatedEvent.end) {
            var newStart = updatedEvent.start;
            var newEnd = updatedEvent.end;

            updatedEvent.start = newEnd;
            updatedEvent.end = newStart;
        }

        setFormState(updatedEvent);
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };

    const handleClick = () => {
        console.log('Button clicked!');
    };
    
    return (
        <>
            <form>
                <label>
                    Nosaukums:
                    <input type="text" name="title" value={formState.title} onChange={handleInputUpdate} />
                </label>
                <label>
                    Sākuma datums:
                    <input type="date" name="start" value={formState.start} onChange={handleInputUpdate} />
                </label>
                <label>
                    Beigu datums:
                    <input type="date" name="end" value={formState.end} onChange={handleInputUpdate} />
                </label>
                <label>
                    Telpas Nr.:
                    <input type="text" name="room" value={formState.room} onChange={handleInputUpdate} />
                </label>
                <label>
                    Gulta:
                    <input type="text" name="bedName" value={formState.bedName} onChange={handleInputUpdate} />
                </label>
                <label>
                    Apraksts:
                    <textarea name="description" value={formState.description} onChange={handleInputUpdate} />
                </label>
                <label>
                    Pacients:
                    <input type="text" name="patientName" value={formState.patientName} onChange={handleInputUpdate} />
                </label>
                <label>
                    Ārsts:
                    <input type="text" name="doctorName" value={formState.doctorName} onChange={handleInputUpdate} />
                </label>
                {/* <label>
                    Viesnīcas datums:
                    <input type="date" name="hotelStayDate" value={formState.hotelStayDate} onChange={handleInputUpdate} />
                </label> */}
            </form>
            <button onClick={handleClick}>
                Atjaunot
            </button>
            <button onClick={handleClick}>
                Dzēst
            </button>
        </>
    );
}

export default EventFormComponent