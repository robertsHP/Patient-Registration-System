import React, { useState, useEffect } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { useCalendarContext } from '../../contexts/CalendarContext.jsx';

import { ActionState } from '../../hooks/useActionStateHook.jsx';

import getCalendarAddFunctions from './utils/getCalendarAddFunctions.jsx';
import getCalendarUnavailabilityFunctions from './utils/getCalendarUnavailabilityFunctions.jsx';

import './CalendarUIComponent.css'

export default function CalendarUIComponent() {
    const { 
        calendarRef,

        disallowedDates,

        actionState, setActionState,

        rooms,
        getRoom,
        selectedRoom, setSelectedRoom,

        events, setEvents,
        getEvent, updateEvent,
        setSelectedEvent
    } = useCalendarContext();

    var properties = {
        processedEvents: rooms ? 
            events.filter(event => event.room === getRoom(selectedRoom.id).num)
            : 
            events,
        processedDisallowedDates: rooms ? 
            disallowedDates.filter(event => event.room === getRoom(selectedRoom.id).num)
            : 
            disallowedDates,
        primaryColor: null,
        secondaryColor: null
    };

    var functions = {};
    var eventsInCalendar = [];

    switch (actionState) {
        case ActionState.ADD :
            properties.primaryColor ='#DB7800';
            properties.secondaryColor ='#FF5959';

            functions = getCalendarAddFunctions({
                ...properties,
            });
            eventsInCalendar = properties.processedEvents;
            break;
        case ActionState.UNAVAILABILITY :
            properties.primaryColor ='#FF5959';
            properties.secondaryColor ='#DB7800';

            functions = getCalendarUnavailabilityFunctions({
                ...properties,
            });
            eventsInCalendar = properties.processedDisallowedDates;
            break;
    }

    ////Atjauno kalendāru
    useEffect(() => {
        var calendarApi = calendarRef.current.getApi();

        ///ATJAUNO KALENDĀRU TĀ KA FULLCALENDAR FUNKCIJAS NO JAUNA PALAIŽ
        calendarApi.next();
        calendarApi.prev();
        ///

    }, [actionState, selectedRoom])

    return (
        <>
            <FullCalendar 
                ref={calendarRef}
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}

                editable={true}
                droppable={true}
                selectable={true}
                eventResizableFromStart={true}

                locale='lv'

                headerToolbar={{
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                }}

                events={eventsInCalendar}
                eventColor={properties.primaryColor}

                select={functions.handleDateSelect}
                eventClick={functions.handleEventClick}
                eventDrop={functions.handleEventDrop}
                eventResize={functions.handleEventResize}
                eventAllow={functions.eventAllow}
                dayCellDidMount={functions.dayCellDidMount}
                datesSet={functions.datesSet}
                eventContent={functions.eventContent}
            />
        </>
    )
}
