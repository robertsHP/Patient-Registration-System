import React, { useState } from 'react';

import { useCalendarContext } from '../../contexts/CalendarContext.jsx';

export default function TableComponent () {
    const { 
        events,
        calendarRef,

        rooms,
        setRoom,
        setSelectedRoom,
        getRoom,
        getRoomWithNumber
    } = useCalendarContext();


    return (
        <div className="global-component">
            
        </div>
    );
}