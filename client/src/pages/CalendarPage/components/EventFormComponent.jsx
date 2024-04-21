import React, { useState, useEffect } from 'react';

import './EventFormComponent.css'

export default function EventFormComponent({ pageData, eventID, getEvent, setEvent }) {
    const [form, setForm] = useState(() => {
        const selectedEvent = getEvent(eventID);

        return pageData.tags.reduce((form, tag) => {
            const label = tag.name;
            const value = selectedEvent[label] || '';

            form[label] = value;

            return form;
        }, {})
    });

    const handleInputUpdate = (event) => {
        const { name, value } = event.target;
        const updatedEvent = { ...form, [name]: value };

        // Swap start and end dates if needed
        if (updatedEvent.start && updatedEvent.end && updatedEvent.start > updatedEvent.end) {
            const { start, end } = updatedEvent;
            updatedEvent.start = end;
            updatedEvent.end = start;
        }

        setForm(updatedEvent);
        setEvent(updatedEvent);
    };

    const handleSaveClick = () => {
        console.log('Save clicked!');
    };

    const handleDeleteClick = () => {
        console.log('Delete clicked!');
    };

    return (
        <div className="global-component">
            <form>
                {pageData.tags.map((tag, index) => {
                    const TagComponent = tag.component;

                    return (
                        <TagComponent 
                            key={index} 
                            name={tag.name} 
                            value={form[tag.name] || ""} 
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
