import React, { useEffect, useState } from 'react';

export default function useEventManagementHook (e, eID) {
    const [events, setEvents] = useState(e);
    const [eventID, setEventID] = useState(eID);

    const getEventByID = (id) => {
        return events.find(event => event.id === id);
    }

    return { events, setEvents, eventID, setEventID, getEventByID };
}