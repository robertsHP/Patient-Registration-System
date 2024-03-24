import React, { useState } from 'react';

import CalendarComponent from '../components/CalendarComponent.jsx';
import EventForm from '../components/EventForm.jsx';

import './CalendarPage.css'

function CalendarPage() {
    const [events, setEvents] = useState([
        { id: 0, title: 'Event 1', start: '2024-03-01', end: '2024-03-01' },
        { id: 1, title: 'Event 2', start: '2024-03-02', end: '2024-03-05' }
    ]);
    const [selEventIndex, setSelEventIndex] = useState(-1);

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
            setSelEventIndex(-1)
        }
    };

    const handleEventClick = (clickInfo) => {
        setSelEventIndex(clickInfo.event.id); // set the clicked event as the selected event
    };

    const handleEventDrop = (dropInfo) => {
        setSelEventIndex(dropInfo.event.id); // update the selected event if it was dragged
    };
    
    const handleEventResize = (info) => {
        setEvents(events.map(event => {
            if (event.id === info.event.id) {
                // Update the start and end dates of the event
                return {
                    ...event,
                    start: info.event.startStr,
                    end: info.event.endStr
                };
            } else {
                return event;
            }
        }));
    }

    const handleEventUpdate = (updatedEvent) => {
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };
    
    return (
        <div className="row-wrapper">
            <div className="column-wrapper">
                <div className="calendar">
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
                    {events[selEventIndex] && 
                        <EventForm 
                            event={events[selEventIndex]} 
                            onEventUpdate={handleEventUpdate}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default CalendarPage