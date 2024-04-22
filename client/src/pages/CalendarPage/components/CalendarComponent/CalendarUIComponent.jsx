import React, { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// import { exportExcel } from '../../service/exportExcel.jsx';

import addFunctions from './functions/addFunctions.jsx';
import unavailabilityFunctions from './functions/unavailabilityFunctions.jsx';

import CalendarOptions from './CalendarOptions.jsx';

import './CalendarUIComponent.css'

export default function CalendarUIComponent(props) {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    let functions = null;
    let events = null;

    switch (props.eventMode) {
        case 'add' :
            events = props.events.filter(
                event => event.room === props.getRoom(props.roomID).num
            );
            functions = addFunctions({...props, month, year});
            break;
        case 'unavailability' :
            events = props.disallowedDates.filter(
                date => date.room === props.getRoom(props.roomID).num
            );
            functions = unavailabilityFunctions({...props, month, year});
            break;
    }

    return (
        <>
            <CalendarOptions 
                eventMode={props.eventMode}
                roomID={props.roomID}
            />
            <FullCalendar
                ref={props.calendarRef}
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}

                editable={true}
                droppable={true}
                selectable={true}
                eventResizableFromStart={true}

                select={functions.handleDateSelect}
                eventClick={functions.handleEventClick}
                eventDrop={functions.handleEventDrop}
                eventResize={functions.handleEventResize}
                eventAllow={functions.eventAllow}
                datesSet={functions.datesSet}
                dayCellDidMount={functions.dayCellDidMount}
                eventContent={functions.eventContent}
                dateClick={functions.dateClick}

                events={events}

                locale='lv'

                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'today'
                }}
                buttonText={{
                    today: 'Šodien'
                }}
            />
        </>
    )
}
