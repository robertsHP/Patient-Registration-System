import React, { useEffect, useState } from 'react';

export default function useEventManagementHook (e, eID) {
    const [events, setEvents] = useState(e);
    const [eventID, setEventID] = useState(eID);

    const getEvent = (id) => {
        return events.find(event => event.id == id);
    }

    const setEvent = (updatedEvent) => {
        setEvents(events.map(
            event => event.id == updatedEvent.id ? updatedEvent : event
        ));
    }

    return { events, setEvents, eventID, setEventID, getEvent, setEvent };
}