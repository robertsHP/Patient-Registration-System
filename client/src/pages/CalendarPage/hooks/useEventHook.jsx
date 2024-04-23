import React, { useEffect, useState } from 'react';

export default function useEventHook (initialEvents, initialEventID) {
    const [events, setEvents] = useState(initialEvents);
    const [eventID, _setEventID] = useState(initialEventID);

    const getEvent = (id) => {
        return events.find(event => event.id == id);
    }

    const [selectedEvent, setSelectedEvent] = useState(getEvent(eventID) || null);

    const setEventID = (id) => {
        _setEventID(id);
        setSelectedEvent(getEvent(id));
    }

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
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));

        if(selectedEvent != null) {
            if(id == selectedEvent.id) {
                _setEventID(-1);
                setSelectedEvent(null);
            }
        }
    }

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
                console.log({...selectedEvent, ...values});
                setSelectedEvent(
                    {...selectedEvent, ...values}
                );
            }
        }
    }

    return { 
        events, setEvents, 
        eventID, setEventID, 
        getEvent, setEvent, 
        updateEvent, deleteEvent,
        selectedEvent, setSelectedEvent };
}
