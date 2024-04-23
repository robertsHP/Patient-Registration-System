import React, { useState, useEffect } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// import { exportExcel } from '../../service/exportExcel.jsx';

import { ActionState } from '../../hooks/useActionStateHook.jsx';

import getCalendarFunctions from './functions/getCalendarFunctions.jsx';

import './CalendarUIComponent.css'

export default function CalendarUIComponent(props) {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    let events = [];
    let disallowedDates= [];
    let functions = {};

    switch (props.actionState) {
        case ActionState.ADD :
            events = props.events.filter(
                event => event.room === props.getRoom(props.roomID).num
            );
            disallowedDates = props.disallowedDates.filter(
                event => event.room === props.getRoom(props.roomID).num
            );
            break;
        case ActionState.UNAVAILABILITY :
            events = props.disallowedDates.filter(
                date => date.room === props.getRoom(props.roomID).num
            );
            disallowedDates = props.events.filter(
                event => event.room === props.getRoom(props.roomID).num
            );
            break;
    }

    functions = getCalendarFunctions({
        ...props,
        events: events,
        disallowedDates: disallowedDates,
        month: month,
        year: year,
        color1: props.actionState.color1,
        color2: props.actionState.color2
    });

    ////Atjauno kalendāru
    useEffect(() => {
        var calendarApi = props.calendarRef.current.getApi();

        ///ATJAUNO KALENDĀRU TĀ KA FUNKCIJAS NO JAUNA PALAIŽ
        calendarApi.next();
        calendarApi.prev();
        ///

        console.log("----UPDATE-----");

    }, [props.actionState, props.roomID])

    return (
        <>
            <FullCalendar 
                ref={props.calendarRef}
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

                events={events}
                eventColor={props.actionState.color1}

                select={functions.handleDateSelect}
                eventClick={functions.handleEventClick}
                eventDrop={functions.handleEventDrop}
                eventResize={functions.handleEventResize}
                eventAllow={functions.eventAllow}
                datesSet={functions.datesSet}
                dayCellDidMount={functions.dayCellDidMount}
                eventContent={functions.eventContent}
            />
        </>
    )
}
