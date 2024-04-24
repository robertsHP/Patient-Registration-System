
import { useCalendarContext } from '../../../contexts/CalendarContext.jsx';
import { formatDate } from './utilFunctions.jsx';

export default function getCalendarAddFunctions ({
    filteredEvents,
    filteredDisallowedDates,
    primaryColor, secondaryColor
}) {
    const { 
        calendarRef,

        disallowedDates,

        actionState, setActionState,

        getRoom,
        selectedRoom,

        events, setEvents,
        setEvent,
        getEvent, updateEvent,
        setSelectedEvent,

        month, setMonth,
        year, setYear
    } = useCalendarContext();

    const handleDateSelect = (info) => {
        // console.log("handleDateSelect");

        let calendarApi = info.view.calendar;
        calendarApi.unselect(); // clear date selection

        let id = events.length;

        let newEvent = {
            id: id, // use the current timestamp as a unique id
            room: selectedRoom.num,
            patientName: "",
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay
        };
        calendarApi.addEvent(newEvent);

        setEvents([...events, newEvent]); // add the new event to the events array
        setSelectedEvent(newEvent);
    }

    const handleEventClick = (info) => {
        // console.log("handleEventClick");
        setSelectedEvent(getEvent(info.event.id)); // set the clicked event as the selected event
    }

    const handleEventDrop = (info) => {
        // console.log("handleEventDrop");

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
        var event = getEvent(info.event.id);
        var newEvent = {...event, start: formattedStartDate, end: formattedEndDate}

        setEvent(info.event.id, newEvent);
        setSelectedEvent(newEvent);
    }

    const handleEventResize = (info) => {
        // console.log("handleEventResize");

        var formattedStartDate = formatDate(info.event.start);
        var formattedEndDate = formatDate(info.event.end);

        var event = getEvent(info.event.id);
        var newEvent = {...event, start: formattedStartDate, end: formattedEndDate}

        setEvent(info.event.id, newEvent);
        setSelectedEvent(newEvent);
    }
    const eventAllow = (info, event) => {
        // console.log("eventAllow");

        var allowed = false;

        for (let i = 0; i < filteredDisallowedDates.length; i++) {
            var disallowedStart = new Date(filteredDisallowedDates[i].start);
            var disallowedEnd = new Date(filteredDisallowedDates[i].end);
    
            allowed = info.start <= disallowedEnd && info.end >= disallowedStart;
    
            // If the event overlaps with this disallowed range, return false
            if (allowed) {
                return false;
            }
        }

        return true;
    }
    const dayCellDidMount = (info) => {
        // console.log("dayCellDidMount");

        var date = info.date;

        // console.log(date);
        
        for (let i = 0; i < filteredDisallowedDates.length; i++) {
            var disallowedStart = new Date(filteredDisallowedDates[i].start);
            var disallowedEnd = new Date(filteredDisallowedDates[i].end);

            disallowedStart.setDate(disallowedStart.getDate() - 1);
    
            var allowed = date <= disallowedEnd && date >= disallowedStart;
    
            // If the event overlaps with this disallowed range, return false
            if (allowed) {
                info.el.style.backgroundColor = secondaryColor;
                return;
            }
        }
        info.el.style.backgroundColor = '#FFFFFF';
    }
    const datesSet = () => {
        // console.log("datesSet");

        if(calendarRef.current != null) {
            let calendarApi = calendarRef.current.getApi();
            let currentDate = calendarApi.getDate();
            let currentMonth = currentDate.getMonth(); // Note: January is 0, February is 1, and so on.
            let currentYear = currentDate.getFullYear();
        
            setMonth(currentMonth);
            setYear(currentYear);

            // console.log(`Currently viewed month: ${month}, year: ${year}`);
        }
    }
    const eventContent = (info) => {
        // console.log("eventContent");

        var eventValues = getEvent(info.event.id);
        var title = '';

        const exists = (value) => {
            return typeof value != 'undefined' && value != '' && value != null;
        };

        if(typeof eventValues != 'undefined') {
            title += exists(eventValues.patientName) ? eventValues.patientName+' ' : '-';
        } else {
            title = '-';
        }

        // console.log(title);

        return {html: title};
    }

    return {
        handleDateSelect: handleDateSelect,
        handleEventClick: handleEventClick,
        handleEventDrop: handleEventDrop,
        handleEventResize: handleEventResize,
        eventAllow: eventAllow,
        dayCellDidMount: dayCellDidMount,
        datesSet: datesSet,
        eventContent: eventContent
    };
}