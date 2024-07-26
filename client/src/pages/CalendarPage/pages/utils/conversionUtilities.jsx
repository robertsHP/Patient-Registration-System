
import LVDate from '../../../../models/LVDate.jsx';

const getDayIndex = (date, monthStart) => {
    const currentDate = new LVDate(date);
    const startDate = new LVDate(monthStart.getFullYear(), monthStart.getMonth(), 1);

    var result = Math.floor((currentDate.getObject() - startDate.getObject()) / (1000 * 60 * 60 * 24));

    return result;
};

export function convertAppointmentForLayoutSupport (event, date) {
    var beginDate = new LVDate(event.begin_date);
    var endDate = new LVDate(event.end_date);

    return {
        ...event,
        begin_date: beginDate,
        end_date: endDate,
        i: `event-${event.id}`,
        x: getDayIndex(event.begin_date, date) + 8,
        y: 0,
        w: getDayIndex(event.end_date, date) - getDayIndex(event.begin_date, date) + 1,
        h: 1,
        extendsToPreviousMonth: false,
        extendsToNextMonth: false,
    };
}

export function convertAppointmentForSendingToDB (room, event) {
    return {
        id_room: room.id,
        patient: event.patient,
        begin_date: event.begin_date.toDateString(),
        end_date: event.end_date.toDateString(),
        notes: event.notes,
        doctor: event.doctor,
    };
}