import React, { useState, useEffect } from 'react';

import './EventFormComponent.css'

export default function EventFormComponent(
    { events, tags, eventID, setEventID, getEvent, setEvent, deleteEvent, selectedEvent, setSelectedEvent }
) {
    useEffect(() => {
        const event = getEvent(eventID);
        setSelectedEvent(event);
    }, [eventID]);

    const [form, setForm] = useState(() => {
        return tags.reduce((form, tag) => {
            console.log(events);
            
            const label = tag.name;
            const value = selectedEvent[label] || '';

            form[label] = value;

            return form;
        }, {});
    });

    const handleInputUpdate = (event) => {
        const { name, value } = event.target;
        const updatedEvent = { 
            id: selectedEvent.id, 
            ...form, 
            [name]: value 
        };

        // Swap start and end dates if needed
        if (updatedEvent.start && updatedEvent.end && updatedEvent.start > updatedEvent.end) {
            const { start, end } = updatedEvent;
            updatedEvent.start = end;
            updatedEvent.end = start;
        }

        setSelectedEvent(updatedEvent);
        setForm(updatedEvent);

        console.log(selectedEvent);
    };

    const handleCloseButtonClick = () => {
        setEventID(-1);
    };

    const handleSaveClick = () => {
        setEvent(selectedEvent.id, selectedEvent);
        console.log('Save clicked!');
    };

    const handleDeleteClick = () => {
        deleteEvent(selectedEvent.id);
        console.log('Delete clicked!');
    };

    return (
        <div className="global-component">
            <div style={{ top: '10px', left: '10px' }}>
                <button onClick={handleCloseButtonClick}>
                    X
                </button>
            </div>
            <form>
                {tags.map((tag, index) => {
                    const TagComponent = tag.component;

                    return (
                        <TagComponent 
                            key={index} 
                            name={tag.name} 
                            value={selectedEvent[tag.name] || ""} 
                            onChange={handleInputUpdate} 
                        />
                    );
                })}
            </form>
            <button onClick={handleSaveClick}>
                Saglabāt
            </button>
            <button onClick={handleDeleteClick}>
                Dzēst
            </button>
        </div>
    );
}
