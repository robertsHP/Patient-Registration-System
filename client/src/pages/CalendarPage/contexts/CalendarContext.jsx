import React, { createContext, useState, useContext } from 'react';

import useActionStateHook, { ActionState } from '../hooks/useActionStateHook.jsx';
import useDisallowedHook from '../hooks/useDisallowedHook.jsx';
import useEventHook from '../hooks/useEventHook.jsx';
import useRoomHook from '../hooks/useRoomHook.jsx';

// Create the context
const CalendarContext = createContext({
    events: [],
    rooms: [],
    disallowedDates: []
});

// Create a provider component
export const CalendarProvider = ({ children, initialStates }) => {
    //IELĀDĒ DATUS
    ///
    //
    const { 
        events, setEvents, 
        getEvent, setEvent, updateEvent, deleteEvent,
        selectedEvent, setSelectedEvent
    } = useEventHook(
        initialStates.events, -1
    );
    ///
    
    const { 
        rooms, setRooms, 
        getRoom, getRoomWithNumber, setRoom, deleteRoom, updateRoom,
        selectedRoom, setSelectedRoom
    } = useRoomHook(
        initialStates.rooms, 0
    );

    const { 
        disallowedDates, setDisallowedDates, 
        getDisallowedDate, setDisallowedDate, 
        updateDisallowedDate, deleteDisallowedDate,
        selectedDisallowedDate, setSelectedDisallowedDate
    } = useDisallowedHook(
        initialStates.disallowedDates, -1
    );

    const {actionState, setActionState} = useActionStateHook(ActionState.ADD);
    const [calendarRef, setCalendarRef] = useState(React.createRef());

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const contextValues = {
        events, setEvents, 
        getEvent, setEvent, 
        updateEvent, deleteEvent,
        selectedEvent, setSelectedEvent,

        rooms, setRooms, deleteRoom, updateRoom,
        selectedRoom, setSelectedRoom,
        getRoom, getRoomWithNumber,
        setRoom,

        disallowedDates, setDisallowedDates,
        getDisallowedDate, setDisallowedDate, 
        updateDisallowedDate, deleteDisallowedDate,
        selectedDisallowedDate, setSelectedDisallowedDate,

        actionState, setActionState,

        calendarRef, setCalendarRef,

        month, setMonth,
        year, setYear
    };

    return (
        <CalendarContext.Provider value={contextValues}>
            {children}
        </CalendarContext.Provider>
    );
}

// Custom hook to use the context
export const useCalendarContext = () => {
    const context = useContext(CalendarContext);
    if (context === undefined) {
        throw new Error('useMyContext must be used within a CalendarProvider');
    }
    return context;
}