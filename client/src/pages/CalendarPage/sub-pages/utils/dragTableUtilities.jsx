
import * as monthUtilities from '../utils/monthUtilities.jsx';

import LVDate from '../../../../models/LVDate.jsx';

const isValidAppointmentPosition = (layoutItem, config) => {
    const dateColumnsStart = config.getDateColumnsStart();
    const dateColumnsEnd = config.getDateColumnsEnd();

    // Ensure the appointment is within date columns
    return (
        layoutItem.x >= dateColumnsStart &&
        (layoutItem.x + layoutItem.w) <= dateColumnsEnd
    );
};

const isOverlapping = (newLayout, appointments, currentAppointmentId) => {
    const overlapping = (appointment1, appointment2) => {
        // Check if y-coordinates are the same
        if (appointment1.y !== appointment2.y) {
            return false;
        }

        // Check if both the starts and ends overlap
        const start1 = appointment1.x;
        const end1 = appointment1.x + appointment1.w;
        const start2 = appointment2.x;
        const end2 = appointment2.x + appointment2.w;

        // Check for overlap: either appointment2 starts within appointment1 or appointment1 
        //starts within appointment2
        const startsOverlap = (start1 >= start2 && start1 <= end2) || (start2 >= start1 && start2 <= end1);
        // Check for overlap: either appointment2 ends within appointment1 or appointment1 
        //ends within appointment2
        const endsOverlap = (end1 >= start2 && end1 <= end2) || (end2 >= start1 && end2 <= end1);

        return startsOverlap && endsOverlap;
    };

    return appointments.some(
        (appointment) => appointment.i !== currentAppointmentId && overlapping(appointment, newLayout)
    );
};

const isInDateColumns = (x, w, config) => {
    const dateColumnsStart = config.getDateColumnsStart();
    const dateColumnsEnd = config.getDateColumnsEnd();

    return x >= dateColumnsStart && (x + w) <= dateColumnsEnd;
};

const getDateBasedOnLayoutPosition = (pos, date, config) => {
    var finalDate = null;

    const dateColumnsStart = config.getDateColumnsStart();
    const dateColumnsEnd = config.getDateColumnsEnd();

    if (pos < dateColumnsStart) {
        const daysCountInPrevMonth = monthUtilities.getDaysOfMonth(
            date.getFullYear(),
            date.getMonth() - 1
        ).length;
        const dateNum = daysCountInPrevMonth - (dateColumnsStart - pos);

        finalDate = new LVDate(
            date.getFullYear(),
            date.getMonth() - 1,
            dateNum
        );
    } else if (pos > dateColumnsEnd) {
        const dateNum = pos - dateColumnsEnd;

        finalDate = new LVDate(
            date.getFullYear(),
            date.getMonth() + 1,
            dateNum
        );
    } else {
        config.dateLayout.forEach((dateLayout) => {
            if (pos == dateLayout.x) {
                finalDate = new LVDate(
                    date.getFullYear(),
                    date.getMonth(),
                    dateLayout.num
                );
            }
        });
    }
    return finalDate;
};

const getPositionBasedOnDate = (tempDate, date, config) => {
    var finalPos = null;

    const dateColumnsStart = config.getDateColumnsStart();
    const dateColumnsEnd = config.getDateColumnsEnd();

    if (tempDate.getMonth() == date.getMonth()) {
        config.dateLayout.forEach((dateLayout) => {
            if (tempDate.getDate() == dateLayout.num) {
                finalPos = dateLayout.x;
                return;
            }
        });
    } else {
        if (tempDate.getMonth() < date.getMonth()) {
            finalPos = dateColumnsStart;
        } else {
            finalPos = dateColumnsEnd;
        }
    }

    return finalPos;
};

const convertAppointmentForLayoutSupport = (appointment, date, config) => {
    var beginDate = new LVDate(appointment.begin_date);
    var endDate = new LVDate(appointment.end_date);

    var hotel_stay_start = new LVDate(appointment.hotel_stay_start);
    var hotel_stay_end = new LVDate(appointment.hotel_stay_end);

    const dateColumnsStart = config.getDateColumnsStart();
    const dateColumnsEnd = config.getDateColumnsEnd();

    // Determine if the appointment extends into the previous or next month
    let extendsToPreviousMonth = beginDate.getMonth() < date.getMonth() || 
                                  beginDate.getFullYear() < date.getFullYear();
    let extendsToNextMonth = endDate.getMonth() > date.getMonth() || 
                             endDate.getFullYear() > date.getFullYear();

    // Calculate x position and width w
    let x, w;

    if (extendsToPreviousMonth) {
        x = dateColumnsStart;  // Start at the beginning of the current month
        w = getPositionBasedOnDate(endDate, date, config) - x + 1;
    } else if (extendsToNextMonth) {
        x = getPositionBasedOnDate(beginDate, date, config);
        w = dateColumnsEnd - x + 1;  // Extend to the end of the current month
    } else {
        x = getPositionBasedOnDate(beginDate, date, config);
        w = endDate.getDate() - beginDate.getDate() + 1;
    }

    return {
        ...appointment,
        begin_date: beginDate,
        end_date: endDate,
        hotel_stay_start: hotel_stay_start,
        hotel_stay_end: hotel_stay_end,
        i: `appointment-${appointment.id}`,
        x: x,
        y: 0,
        w: w,
        h: 1,
        extendsToPreviousMonth: extendsToPreviousMonth,
        extendsToNextMonth: extendsToNextMonth,
    };
};


const convertAppointmentForSendingToDB = (room, appointment) => {
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
};

export {
    isValidAppointmentPosition,
    isOverlapping,
    isInDateColumns,
    getDateBasedOnLayoutPosition,
    getPositionBasedOnDate,
    convertAppointmentForLayoutSupport,
    convertAppointmentForSendingToDB
};