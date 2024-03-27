import React, { useState, useEffect } from 'react';

import './EventForm.css'

function EventForm ({ events, selEventID, onEventUpdate }) {
    var event = events[selEventID];

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
            id: event.id || '',
            title: event.title || '',
            start: event.start || '',
            end: event.end || '',
            room: event.room || '',
            bedName: event.bedName || '',
            description: event.description || '',
            patientName: event.patientName || '',
            doctorName: event.doctorName || '',
            hotelStayDate: event.hotelStayDate || ''
        });
    }, [event]);
    
    const handleChange = (event) => {
        console.log("handleChange");

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
        onEventUpdate(updatedEvent);
    };
    
    return (
        <>
            <form>
                <label>
                    ID:
                    <input type="text" name="id" value={formState.id} onChange={handleChange} />
                </label>
                <label>
                    Nosaukums:
                    <input type="text" name="title" value={formState.title} onChange={handleChange} />
                </label>
                <label>
                    Sākuma datums:
                    <input type="date" name="start" value={formState.start} onChange={handleChange} />
                </label>
                <label>
                    Beigu datums:
                    <input type="date" name="end" value={formState.end} onChange={handleChange} />
                </label>
                <label>
                    Telpas Nr.:
                    <input type="text" name="room" value={formState.room} onChange={handleChange} />
                </label>
                <label>
                    Gulta:
                    <input type="text" name="bedName" value={formState.bedName} onChange={handleChange} />
                </label>
                <label>
                    Apraksts:
                    <textarea name="description" value={formState.description} onChange={handleChange} />
                </label>
                <label>
                    Pacients:
                    <input type="text" name="patientName" value={formState.patientName} onChange={handleChange} />
                </label>
                <label>
                    Ārsts:
                    <input type="text" name="doctorName" value={formState.doctorName} onChange={handleChange} />
                </label>
                {/* <label>
                    Viesnīcas datums:
                    <input type="date" name="hotelStayDate" value={formState.hotelStayDate} onChange={handleChange} />
                </label> */}
            </form>
        </>
    );
}

export default EventForm