
import LVDate from '../../../../models/LVDate.jsx';

const getDayIndex = (date, monthStart) => {
    const currentDate = new LVDate(date);
    const startDate = new LVDate(monthStart.getFullYear(), monthStart.getMonth(), 1);

    var result = Math.floor((currentDate.getObject() - startDate.getObject()) / (1000 * 60 * 60 * 24));

    return result;
};

export function convertAppointmentForLayoutSupport (appointment, date) {
    var beginDate = new LVDate(appointment.begin_date);
    var endDate = new LVDate(appointment.end_date);

    var hotel_stay_start = new LVDate(appointment.hotel_stay_start);
    var hotel_stay_end = new LVDate(appointment.hotel_stay_end);

    return {
        ...appointment,
        begin_date: beginDate,
        end_date: endDate,
        hotel_stay_start: hotel_stay_start,
        hotel_stay_end: hotel_stay_end,
        i: `appointment-${appointment.id}`,
        x: getDayIndex(appointment.begin_date, date) + 8,
        y: 0,
        w: getDayIndex(appointment.end_date, date) - getDayIndex(appointment.begin_date, date) + 1,
        h: 1,
        extendsToPreviousMonth: false,
        extendsToNextMonth: false,
    };
}

export function convertAppointmentForSendingToDB (room, appointment) {
    var hotel_stay_start = hotel_stay_start != null ? appointment.hotel_stay_start.toDateString() : null;
    var hotel_stay_end = hotel_stay_end != null ? appointment.hotel_stay_end.toDateString() : null;

    return {
        id_room: room.id,
        patient: appointment.patient,
        begin_date: appointment.begin_date.toDateString(),
        end_date: appointment.end_date.toDateString(),
        notes: appointment.notes,
        doctor: appointment.doctor,
        hotel_stay_start: hotel_stay_start,
        hotel_stay_end: hotel_stay_end,
        appointment_type: appointment.appointment_type
    };
}