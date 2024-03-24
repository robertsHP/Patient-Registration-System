import React from 'react';
import { useState } from 'react'

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

import './CalendarComponent.css'

function CalendarComponent () {
    const [events, setEvents] = useState([
        { title: 'Event 1', start: '2024-03-01' },
        { title: 'Event 2', start: '2024-03-02', end: '2024-03-05' },
        { title: 'Event 3', start: '2024-03-06T12:30:00', allDay: false }
    ]);

    const addEvent = (event) => {
        setEvents(prevEvents => [...prevEvents, event]);
    };

    const handleDateSelect = (selectInfo) => {
        let title = prompt('Please enter a new title for your event');
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (title) {
            let newEvent = {
                id: Date.now(), // use the current timestamp as a unique id
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            };
            calendarApi.addEvent(newEvent);
            addEvent(newEvent); // add the new event to the events array
        }
    };

    return (
        <FullCalendar
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            editable={true}
            droppable={true}
            selectable={true}
            eventResizableFromStart={true}
            // dateClick={handleDateSelect}
            select={handleDateSelect}
            events={events}
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
        />
    )
}


export default CalendarComponent