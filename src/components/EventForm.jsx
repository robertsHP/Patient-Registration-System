import React, { useState } from 'react';

import './EventForm.css'

function EventForm () {
    const [formState, setFormState] = useState({
        eventName: '',
        fromDate: '',
        toDate: '',
        room: '',
        bedName: '',
        description: '',
        patientName: '',
        doctorName: '',
        hotelTimeFrame: ''
    });
    
    const handleChange = (event) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value
        });
    };
    
    return (
        <>
            <form>
                <label>
                    Event Name:
                    <input type="text" name="eventName" onChange={handleChange} />
                </label>
                <label>
                    From Date:
                    <input type="date" name="fromDate" onChange={handleChange} />
                </label>
                <label>
                    To Date:
                    <input type="date" name="toDate" onChange={handleChange} />
                </label>
                <label>
                    Room:
                    <input type="text" name="room" onChange={handleChange} />
                </label>
                <label>
                    Bed Name:
                    <input type="text" name="bedName" onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <textarea name="description" onChange={handleChange} />
                </label>
                <label>
                    Patient Name:
                    <input type="text" name="patientName" onChange={handleChange} />
                </label>
                <label>
                    Doctor Name:
                    <input type="text" name="doctorName" onChange={handleChange} />
                </label>
                <label>
                    Hotel Time Frame:
                    <input type="text" name="hotelTimeFrame" onChange={handleChange} />
                </label>
            </form>
        </>
    );
}

export default EventForm