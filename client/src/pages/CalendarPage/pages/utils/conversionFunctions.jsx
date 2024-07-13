

const getDayIndex = (date, monthStart) => {
    const startDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    return Math.floor((new Date(date) - startDate) / (1000 * 60 * 60 * 24));
};

export function convertEventForLayoutSupport (event, date) {
    return {
        ...event,
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
        begin_date: new Date(event.begin_date),
        end_date: new Date(event.end_date),
        notes: event.notes,
        id_doctor: doc_id,
    };
}