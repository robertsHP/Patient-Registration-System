import React, { useEffect, useState } from 'react';

export default function useEventHook (initialEvents, initialEventID) {
    const [events, setEvents] = useState(initialEvents);

    const getEvent = (id) => {
        return events.find(event => event.id == id);
    }

    const [selectedEvent, setSelectedEvent] = useState(getEvent(initialEventID) || null);

    const setEvent = (id, updatedEvent) => {
        setEvents(events.map(
            event => event.id == id ? updatedEvent : event
        ));

        if(selectedEvent != null) {
            if(id == selectedEvent.id) {
                setSelectedEvent(updatedEvent);
            }
        }
    }

    const deleteEvent = (id) => {
        setEvents(events => events.filter(event => event.id != id));

        if (selectedEvent && id === selectedEvent.id) {
            setSelectedEvent(null);
        }
    };

    const updateEvent = (id, values) => {
        setEvents(events.map(
            event => event.id == id 
            ? 
            {...event, ...values} 
            : 
            event
        ));

        if(selectedEvent != null) {
            if(id == selectedEvent.id) {
                setSelectedEvent(
                    {...selectedEvent, ...values}
                );
            }
        }
    }

    return { 
        events, setEvents, 
        getEvent, setEvent, 
        updateEvent, deleteEvent,
        selectedEvent, setSelectedEvent 
    };
}
