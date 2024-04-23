

function formatDate (date) {
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
}

export default function getCalendarFunctions (props) {
    const eventContent = (info) => {
        console.log("eventContent");

        var eventValues = props.getEvent(info.event.id);
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

    const handleDateSelect = (info) => {
        console.log("handleDateSelect");

        let calendarApi = info.view.calendar;
        calendarApi.unselect(); // clear date selection

        let id = props.events.length;

        let newEvent = {
            id: id, // use the current timestamp as a unique id
            room: props.getRoom(props.roomID).num,
            patientName: "",
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay
        };
        calendarApi.addEvent(newEvent);

        props.setEvents([...props.events, newEvent]); // add the new event to the events array
        props.setEventID(id);
        props.setSelectedEvent(newEvent);
    }

    const handleEventClick = (info) => {
        console.log("handleEventClick");
        props.setEventID(info.event.id); // set the clicked event as the selected event
    }

    const handleEventDrop = (info) => {
        console.log("handleEventDrop");

        //Dabū notikumu datumus no tā, kas tika pārcelts 
        var startDate = info.event.start;
        var endDate = info.event.end;

        //pārbaude gadījumā ja sākuma datums ir vienāds ar beigu (pārvēršas par null)
        if(endDate === null) {
            endDate = startDate;
        }

        //pārveido atbilstošā formātā
        var formattedStartDate = formatDate(startDate);
        var formattedEndDate = formatDate(endDate);

        //maina konkrēto pierakstu
        props.updateEvent(
            info.event.id, { start: formattedStartDate, end: formattedEndDate }
        );
    }

    const handleEventResize = (info) => {
        console.log("handleEventResize");

        var formattedStartDate = formatDate(info.event.start);
        var formattedEndDate = formatDate(info.event.end);

        props.updateEvent(
            info.event.id, { start: formattedStartDate, end: formattedEndDate }
        );
    }
    const eventAllow = (info, event) => {
        console.log("eventAllow");

        var allowed = false;

        for (let i = 0; i < props.disallowedDates.length; i++) {
            var disallowedStart = new Date(props.disallowedDates[i].start);
            var disallowedEnd = new Date(props.disallowedDates[i].end);
    
            allowed = info.start <= disallowedEnd && info.end >= disallowedStart;
    
            // If the event overlaps with this disallowed range, return false
            if (allowed) {
                return false;
            }
        }

        return true;
    }
    const datesSet = () => {
        console.log("datesSet");

        if(props.calendarRef.current != null) {
            let calendarApi = props.calendarRef.current.getApi();
            let date = calendarApi.getDate();
            let month = date.getMonth(); // Note: January is 0, February is 1, and so on.
            let year = date.getFullYear();
        
            props.month = month;
            props.year = year;

            console.log(`Currently viewed month: ${month}, year: ${year}`);
        }
    }
    const dayCellDidMount = (info) => {
        console.log("dayCellDidMount");

        var date = info.date;
        
        for (let i = 0; i < props.disallowedDates.length; i++) {
            var disallowedStart = new Date(props.disallowedDates[i].start);
            var disallowedEnd = new Date(props.disallowedDates[i].end);

            disallowedStart.setDate(disallowedStart.getDate() - 1);
    
            var allowed = date <= disallowedEnd && date >= disallowedStart;
    
            // If the event overlaps with this disallowed range, return false
            if (allowed) {
                info.el.style.backgroundColor = props.color2;
                return;
            }
        }
        info.el.style.backgroundColor = '#FFFFFF';
    }

    return {
        handleDateSelect: handleDateSelect,
        handleEventClick: handleEventClick,
        handleEventDrop: handleEventDrop,
        handleEventResize: handleEventResize,
        eventAllow: eventAllow,
        datesSet: datesSet,
        dayCellDidMount: dayCellDidMount,
        eventContent: eventContent
    };
}