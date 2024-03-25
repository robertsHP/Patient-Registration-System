import React, { useState, useEffect } from 'react';

import './EventForm.css'

function EventForm ({ event, onEventUpdate }) {
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
        const updatedEvent = {
            ...formState,
            [event.target.name]: event.target.value
        };

        // If the start date is after the end date, swap them
        if (updatedEvent.start > updatedEvent.end) {
            [updatedEvent.start, updatedEvent.end] = [updatedEvent.end, updatedEvent.start];
        }

        setFormState(updatedEvent);
        onEventUpdate(updatedEvent);
    };

    
    return (
        <>
            <form>
                <label>
                    Event Name:
                    <input type="text" name="id" value={formState.id} onChange={handleChange} />
                </label>
                <label>
                    Event Name:
                    <input type="text" name="title" value={formState.title} onChange={handleChange} />
                </label>
                <label>
                    From Date:
                    <input type="date" name="start" value={formState.start} onChange={handleChange} />
                </label>
                <label>
                    To Date:
                    <input type="date" name="end" value={formState.end} onChange={handleChange} />
                </label>
                <label>
                    Room:
                    <input type="text" name="room" value={formState.room} onChange={handleChange} />
                </label>
                <label>
                    Bed Name:
                    <input type="text" name="bedName" value={formState.bedName} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={formState.description} onChange={handleChange} />
                </label>
                <label>
                    Patient Name:
                    <input type="text" name="patientName" value={formState.patientName} onChange={handleChange} />
                </label>
                <label>
                    Doctor Name:
                    <input type="text" name="doctorName" value={formState.doctorName} onChange={handleChange} />
                </label>
                <label>
                    Hotel Time Frame:
                    <input type="date" name="hotelStayDate" value={formState.hotelStayDate} onChange={handleChange} />
                </label>
            </form>
        </>
    );
}

export default EventForm