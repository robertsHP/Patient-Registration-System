import React, { useState } from 'react';

import { useCalendarContext } from '../../../contexts/CalendarContext.jsx';
// import { formatDate } from './utilFunctions.jsx';

export default function getEventFormFunctions ({formTags}) {
    const { 
        events, setEvents, 
        getEvent, setEvent, updateEvent, deleteEvent,
        selectedEvent, setSelectedEvent
    } = useCalendarContext();

    // const [form, setForm] = useState(() => {
    //     return formTags.reduce((form, tag) => {
    //         const label = tag.name;
    //         const value = selectedEvent[label] || '';

    //         form[label] = value;

    //         return form;
    //     }, {});
    // });

    const handleInputUpdate = (event) => {
        const { name, value } = event.target;
        const updatedEvent = { 
            ...selectedEvent, 
            [name]: value 
        };

        // Swap start and end dates if needed
        if (updatedEvent.start && updatedEvent.end && updatedEvent.start > updatedEvent.end) {
            const { start, end } = updatedEvent;
            updatedEvent.start = end;
            updatedEvent.end = start;
        }

        setSelectedEvent(updatedEvent);
        // setForm(updatedEvent);

        // console.log(selectedEvent);
    };

    const handleCloseButtonClick = () => {
        setSelectedEvent(null);
    };

    const handleSaveClick = () => {
        // console.log(events);
        // console.log(selectedEvent);

        setEvent(selectedEvent.id, selectedEvent);
        // setForm(selectedEvent);

        // console.log(events);
        // console.log(selectedEvent);

        // console.log('Save clicked!');
    };

    const handleDeleteClick = () => {
        deleteEvent(selectedEvent.id);
        setSelectedEvent(null);
        // console.log('Delete clicked!');
    };

    return {
        handleInputUpdate: handleInputUpdate,
        handleCloseButtonClick: handleCloseButtonClick,
        handleSaveClick: handleSaveClick,
        handleDeleteClick: handleDeleteClick
    };
}