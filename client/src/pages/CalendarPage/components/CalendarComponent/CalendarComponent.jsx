import React, { useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// import { exportExcel } from '../../service/exportExcel.jsx';

import CalendarOptions from './CalendarOptions.jsx';

import './CalendarComponent.css'

export default class CalendarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            calendarRef: React.createRef(),

            month: new Date().getMonth(),
            year: new Date().getYear(),

            eventMode: 'add',
            roomIndex: 0,

            disallowedDates: [
                {start: '2024-04-10', end: '2024-04-15'},
                // {start: '2024-04-17', end: '2024-04-20'}
            ]
        }

        this.handleDateSelect = this.handleDateSelect.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.handleEventDrop = this.handleEventDrop.bind(this);
        this.handleEventResize = this.handleEventResize.bind(this);
        this.eventAllow = this.eventAllow.bind(this);
        this.datesSet = this.datesSet.bind(this);
        // this.dayCellContent = this.dayCellContent.bind(this);
        this.dayCellDidMount = this.dayCellDidMount.bind(this);
        this.eventContent = this.eventContent.bind(this);
    }

    render() {
        return (
            <>
                <CalendarOptions 

                />
                <FullCalendar
                    ref={this.state.calendarRef}
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
                    datesSet={this.datesSet}
                    dayCellDidMount={this.dayCellDidMount}
                    eventContent={this.eventContent}
                    dateClick={this.dateClick}

                    events={this.props.events}

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
    datesSet () {
        if(this.state.calendarRef.current != null) {
            let calendarApi = this.state.calendarRef.current.getApi();
            let date = calendarApi.getDate();
            let month = date.getMonth(); // Note: January is 0, February is 1, and so on.
            let year = date.getFullYear();
        
            this.state.month = month;
            this.state.year = year;

            console.log(`Currently viewed month: ${month}, year: ${year}`);
        }
    }
    eventAllow (info, event) {
        console.log("eventAllow");

        var allowed = false;

        for (let i = 0; i < this.state.disallowedDates.length; i++) {
            var disallowedStart = new Date(this.state.disallowedDates[i].start);
            var disallowedEnd = new Date(this.state.disallowedDates[i].end);
    
            allowed = info.start <= disallowedEnd && info.end >= disallowedStart;
    
            // If the event overlaps with this disallowed range, return false
            if (allowed) {
                return false;
            }
        }

        return true;
    }
    dayCellDidMount (info) {
        var date = info.date;

        for (let i = 0; i < this.state.disallowedDates.length; i++) {
            var disallowedStart = new Date(this.state.disallowedDates[i].start);
            var disallowedEnd = new Date(this.state.disallowedDates[i].end);

            disallowedStart.setDate(disallowedStart.getDate() - 1);
    
            var allowed = date <= disallowedEnd && date >= disallowedStart;
    
            // If the event overlaps with this disallowed range, return false
            if (allowed) {
                info.el.style.backgroundColor = '#FF9B9B';
                return;
            }
        }
        info.el.style.backgroundColor = '#FFFFFF';
    }
    eventContent (info) {
        var eventValues = this.props.getEvent(info.event.id);
        var title = '';

        const exists = (value) => {
            return typeof value != 'undefined' && value != '' && value != null;
        };

        if(typeof eventValues != 'undefined') {
            title += exists(eventValues.name) ? eventValues.name+' ' : '-';
            title += exists(eventValues.room) ? eventValues.room+' ' : '';
            title += exists(eventValues.bedName) ? eventValues.bedName+' ' : '';
        } else {
            title = '-';
        }

        console.log(title);

        return {html: title};
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

        //maina konkrēto pierakstu
        var event = this.props.getEvent(info.event.id);
        this.props.updateEvent(
            info.event.id, { start: formattedStartDate, end: formattedEndDate }
        );
    }

    handleEventResize(info) {
        console.log("handleEventResize");

        var formattedStartDate = this.formatDate(info.event.start);
        var formattedEndDate = this.formatDate(info.event.end);

        var event = this.props.getEvent(info.event.id);
        this.props.updateEvent(
            info.event.id, { start: formattedStartDate, end: formattedEndDate }
        );
    }
}