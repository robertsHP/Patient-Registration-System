
import LVDate from '../../../../models/LVDate.jsx';

const getDayIndex = (date, monthStart) => {
    const currentDate = new LVDate(date);
    const startDate = new LVDate(monthStart.getFullYear(), monthStart.getMonth(), 1);

    var result = Math.floor((currentDate.getDate() - startDate.getDate()) / (1000 * 60 * 60 * 24));

    return result;
};

export function convertEventForLayoutSupport (event, date) {
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
        h: 1
    };
}

export function convertEventForSendingToDB (room, event) {
    var doc_id = event.doctor.id == null ? null : event.doctor.id;
    var patient_id = event.patient.id == null ? null : event.patient.id;

    return {
        id_room: room.id,
        id_patient: patient_id,
        begin_date: event.begin_date.toDateString(),
        end_date: event.end_date.toDateString(),
        notes: event.notes,
        id_doctor: doc_id,
    };
}