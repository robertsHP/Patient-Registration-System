import React, { useEffect, useState } from 'react';

// export default function useEventManagementHook (initialEvents, initialEventID) {
//     const [events, setEvents] = useState(initialEvents);
//     const [eventID, setEventID] = useState(initialEventID);

//     const getEvent = (id) => {
//         return events.find(event => event.id == id);
//     }

//     const setEvent = (updatedEvent) => {
//         setEvents(events.map(
//             event => event.id == updatedEvent.id ? updatedEvent : event
//         ));
//     }

//     return { events, setEvents, eventID, setEventID, getEvent, setEvent };
// }
