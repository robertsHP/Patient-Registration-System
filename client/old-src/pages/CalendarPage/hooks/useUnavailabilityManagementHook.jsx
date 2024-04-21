import React, { useEffect, useState } from 'react';

export default function useUnavailabilityManagementHook (u, uID) {
    const [unavailableRanges, setUnavailableRanges] = useState(u);
    const [unavailableID, setUnavailableID] = useState(uID);

    const getUnavailableDate = (id) => {
        return unavailableRanges.find(range => date.id == id);
    }

    const setUnavailableRange = (updatedDate) => {
        setUnavailableRanges(unavailableRanges.map(
            range => date.id == updatedEvent.id ? updatedEvent : event
        ));
    }

    return { events, setEvents, eventID, setEventID, getEvent, setEvent };
}