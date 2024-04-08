import React, { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import './CalendarComponent.css'

export default class CalendarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.disallowedDates = [
            {start: '2024-04-10', end: '2024-04-15'},
            {start: '2024-04-17', end: '2024-04-20'}
        ];

        this.handleDateSelect = this.handleDateSelect.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.handleEventDrop = this.handleEventDrop.bind(this);
        this.handleEventResize = this.handleEventResize.bind(this);
        this.eventAllow = this.eventAllow.bind(this);
    }

    render() {
        return (
            <FullCalendar
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}

                editable={true}
                droppable={true}
                selectable={true}
                eventResizableFromStart={true}

                select={this.handleDateSelect}
                eventClick={this.handleEventClick}
                eventDrop={this.handleEventDrop}
                eventResize={this.handleEventResize}
                eventAllow={this.eventAllow}

                events={this.props.events}

                locale='lv'

                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                    today: 'Šodienas mēnesis',
                    month: 'Mēneši',
                    week: 'Nedēļas',
                    day: 'Dienas'
                }}
            />
        )
    }

    eventAllow (info, event) {
        console.log("eventAllow");

        var allowed = false;

        for (let i = 0; i < this.disallowedDates.length; i++) {
            var disallowedStart = new Date(this.disallowedDates[i].start);
            var disallowedEnd = new Date(this.disallowedDates[i].end);
    
            allowed = info.start < disallowedEnd && info.end > disallowedStart;
    
            // If the event overlaps with this disallowed range, return false
            if (allowed) {
                return false;
            }
        }

        return true;
    }

    handleDateSelect(info) {
        console.log("handleDateSelect");

        let calendarApi = info.view.calendar;
        calendarApi.unselect(); // clear date selection

        let id = this.props.events.length;

        let newEvent = {
            id: id, // use the current timestamp as a unique id
            title: '',
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay
        };
        calendarApi.addEvent(newEvent);

        this.props.setEvents([...this.props.events, newEvent]); // add the new event to the events array
        this.props.setEventID(id);
    }

    handleEventClick(info) {
        console.log("handleEventClick");
        this.props.setEventID(info.event.id); // set the clicked event as the selected event
    }

    formatDate (date) {
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }

    handleEventDrop(info) {
        console.log("handleEventDrop");

        //Dabū notikumu datumus no tā, kas tika pārcelts 
        var startDate = info.event.start;
        var endDate = info.event.end;

        //pārbaude gadījumā ja sākuma datums ir vienāds ar beigu (pārvēršas par null)
        if(endDate === null) {
            endDate = startDate;
        }

        //pārveido atbilstošā formātā
        var formattedStartDate = this.formatDate(startDate);
        var formattedEndDate = this.formatDate(endDate);

        //maina konkrēto notikumu
        this.props.setEvents(this.props.events.map(event => {
            if (event.id == info.event.id) {
                return { ...event, start: formattedStartDate, end: formattedEndDate };
            } else {
                return event;
            }
        }));
    }

    handleEventResize(info) {
        console.log("handleEventResize");

        var formattedStartDate = this.formatDate(info.event.start);
        var formattedEndDate = this.formatDate(info.event.end);

        this.props.setEvents(this.props.events.map(event => {
            if (event.id == info.event.id) {
              return { ...event, start: formattedStartDate, end: formattedEndDate };
            } else {
              return event;
            }
        }));
    }

    renderEventContent(eventInfo) {
        return (
            <>
              <b>{eventInfo.event.title}</b>
              <div>{eventInfo.event.extendedProps.description}</div>
            </>
        );
    }
}