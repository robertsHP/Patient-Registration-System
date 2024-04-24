
import { useCalendarContext } from '../../../contexts/CalendarContext.jsx';
import { formatDate } from './utilFunctions.jsx';

export default function getCalendarUnavailabilityFunctions ({
    processedEvents,
    processedDisallowedDates,
    primaryColor, secondaryColor
}) {
    const { 
        calendarRef,

        events,

        actionState, setActionState,

        getRoom, selectedRoom,

        disallowedDates, setDisallowedDates, 
        getDisallowedDate, setDisallowedDate, 
        updateDisallowedDate, deleteDisallowedDate,
        selectedDisallowedDate, setSelectedDisallowedDate,

        month, setMonth,
        year, setYear
    } = useCalendarContext();

    const handleDateSelect = (info) => {
        // console.log("handleDateSelect");

        let calendarApi = info.view.calendar;
        calendarApi.unselect(); // clear date selection

        let id = disallowedDates.length;

        let newDate = {
            id: id, // use the current timestamp as a unique id
            description: "",
            start: info.startStr,
            end: info.endStr
        };
        if (selectedRoom) {
            newEvent.room = selectedRoom.num;
        }
        calendarApi.addEvent(newDate);

        setDisallowedDates([...disallowedDates, newDate]); // add the new event to the events array
        setSelectedDisallowedDate(newDate);

        console.log(disallowedDates);
    }

    const handleEventClick = (info) => {
        // console.log("handleEventClick");
        setSelectedDisallowedDate(
            getDisallowedDate(info.event.id)
        ); // set the clicked event as the selected event
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
        var date = getDisallowedDate(info.event.id);
        var newDate = {...date, start: formattedStartDate, end: formattedEndDate}

        setDisallowedDate(info.event.id, newDate);
        setSelectedDisallowedDate(newDate);
    }

    const handleEventResize = (info) => {
        // console.log("handleEventResize");

        var formattedStartDate = formatDate(info.event.start);
        var formattedEndDate = formatDate(info.event.end);

        //maina konkrēto pierakstu
        var date = getDisallowedDate(info.event.id);
        var newDate = {...date, start: formattedStartDate, end: formattedEndDate}

        setDisallowedDate(info.event.id, newDate);
        setSelectedDisallowedDate(newDate);
    }
    const eventAllow = (info, event) => {
        // console.log("eventAllow");

        var allowed = false;

        for (let i = 0; i < processedEvents.length; i++) {
            var disallowedStart = new Date(processedEvents[i].start);
            var disallowedEnd = new Date(processedEvents[i].end);
    
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
        
        for (let i = 0; i < processedEvents.length; i++) {
            var disallowedStart = new Date(processedEvents[i].start);
            var disallowedEnd = new Date(processedEvents[i].end);

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
            let date = calendarApi.getDate();
            let month = date.getMonth(); // Note: January is 0, February is 1, and so on.
            let year = date.getFullYear();
        
            month = month;
            year = year;

            console.log(`Currently viewed month: ${month}, year: ${year}`);
        }
    }
    const eventContent = (info) => {
        // console.log("eventContent");

        var id = info.event.id;

        var dateEventValues = getDisallowedDate(id);
        var title = '';

        const exists = (value) => {
            return typeof value != 'undefined' && value != '' && value != null;
        };

        if(typeof dateEventValues != 'undefined') {
            title += exists(dateEventValues.description) ? dateEventValues.description+' ' : '-';
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