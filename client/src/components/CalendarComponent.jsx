import React, { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

import './CalendarComponent.css'

function CalendarComponent ({ events, handleDateSelect, handleEventClick, handleEventDrop, handleEventResize }) {
    const renderEventContent = (eventInfo) => {
        return (
            <>
              <b>{eventInfo.event.title}</b>
              <div>{eventInfo.event.extendedProps.description}</div>
            </>
        );
    };

    return (
        <FullCalendar
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            editable={true}
            droppable={true}
            selectable={true}
            eventResizableFromStart={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            events={events}
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth, timeGridWeek, timeGridDay'
            }}
        />
    )
}


export default CalendarComponent