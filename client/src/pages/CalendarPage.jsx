import React, { useState } from 'react';

import { formatDate } from '@fullcalendar/core';

import SearchComponent from '../components/SearchComponent.jsx';
import CalendarComponent from '../components/CalendarComponent.jsx';
import EventFormComponent from '../components/EventFormComponent.jsx';

import './CalendarPage.css'

function CalendarPage() {
    const [events, setEvents] = useState([
        { id: 0, title: 'Event 1', start: '2024-03-01', end: '2024-03-01' },
        { id: 1, title: 'Event 2', start: '2024-03-02', end: '2024-03-05' }
    ]);
    const [selEventID, setSelEventID] = useState(-1);

    const handleDateSelect = (selectInfo) => {
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (selectInfo) {
            let newEvent = {
                id: events.length, // use the current timestamp as a unique id
                title: '',
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            };
            calendarApi.addEvent(newEvent);
            setEvents([...events, newEvent]); // add the new event to the events array
        } else {
            setSelEventID(-1)
        }
    };

    const handleEventClick = (clickInfo) => {
        console.log("handleEventClick");
        setSelEventID(clickInfo.event.id); // set the clicked event as the selected event
    };

    const handleEventDrop = (dropInfo) => {
        console.log("handleEventDrop");

        var startDate = dropInfo.event.start; // This is the new start date
        var endDate = dropInfo.event.end; // This is the new end date

        var formattedStartDate = formatDate(startDate, {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            delimiter: '-'
        });
        
        var formattedEndDate = formatDate(endDate, {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            delimiter: '-'
        });

        console.log('New Start Date: ' + formattedStartDate);
        console.log('New End Date: ' + formattedEndDate);

        setEvents(events.map(event => {
            if (event.id === dropInfo.event.id) {
              return { ...event, start: formattedStartDate, end: formattedEndDate };
            } else {
              return event;
            }
        }));
    };
    
    const handleEventResize = (info) => {
        console.log("handleEventResize");
        setEvents(events.map(event => {
            if (event.id === info.event.id) {
              return { ...event, start: formattedStartDate, end: formattedEndDate };
            } else {
              return event;
            }
        }));
    }

    const handleEventUpdate = (updatedEvent) => {
        console.log("handleEventUpdate");
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };
    
    return (
        <div className="row-wrapper">
            <div className="column-wrapper">
                <div className="calendar">
                    <SearchComponent />
                    <CalendarComponent 
                        events={events}
                        handleDateSelect={handleDateSelect}
                        handleEventClick={handleEventClick}
                        handleEventDrop={handleEventDrop}
                        handleEventResize={handleEventResize}
                    />
                </div>
                <div className="event-form">
                    {/* //In JavaScript, the && operator returns the first falsy value if there is one.
                    //So if selectedEvent is null or undefined then nothing will be rendered. */}
                    {events[selEventID] && 
                        <EventFormComponent 
                            events={events} 
                            selEventID={selEventID}
                            onEventUpdate={handleEventUpdate}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default CalendarPage