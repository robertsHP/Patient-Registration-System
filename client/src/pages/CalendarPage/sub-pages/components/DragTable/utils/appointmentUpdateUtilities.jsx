import LVDate from '../../../../../../models/LVDate.jsx';

import * as dragTableUtilities from './dragTableUtilities.jsx';
import * as monthUtilities from '../../../utils/monthUtilities.jsx';

const calculateAppointmentUpdates = (appointment, newStartDatePos, newEndDatePos, currentDate, config) => {
    const dateColumnsStart = config.getDateColumnsStart();
    const dateColumnsEnd = config.getDateColumnsEnd();

    const prevMonth = new LVDate(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const nextMonth = new LVDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    const daysCountInPrevMonth = monthUtilities.getDaysOfMonth(
        prevMonth.getFullYear(), 
        prevMonth.getMonth()
    ).length;
    const daysCountInCurrentMonth = monthUtilities.getDaysOfMonth(
        currentDate.getFullYear(), 
        currentDate.getMonth()
    ).length;
    const daysCountInNextMonth = monthUtilities.getDaysOfMonth(
        nextMonth.getFullYear(), 
        nextMonth.getMonth()
    ).length;

    let finalBeginDate = null;
    let finalExtendsToPreviousMonth = false;
    let finalEndDate = null;
    let finalExtendsToNextMonth = false;
    let outOfCurrentMonth = false;

    // Fully moved to previous month
    if (newEndDatePos < dateColumnsStart) {
        const endLoss = dateColumnsStart - newEndDatePos;
        finalEndDate = new LVDate(
            prevMonth.getFullYear(), 
            prevMonth.getMonth(), 
            daysCountInPrevMonth - endLoss
        );

        finalBeginDate = new LVDate(
            prevMonth.getFullYear(), 
            prevMonth.getMonth(), 
            Math.max(1, finalEndDate.getDate() - (appointment.end_date.getDate() - appointment.begin_date.getDate()))
        );

        finalExtendsToPreviousMonth = true;
        outOfCurrentMonth = true;
    }
    // Fully moved to next month
    else if (newStartDatePos > dateColumnsEnd) {
        const startGain = newStartDatePos - dateColumnsEnd;
        finalBeginDate = new LVDate(
            nextMonth.getFullYear(), 
            nextMonth.getMonth(), 
            1 + startGain
        );

        finalEndDate = new LVDate(
            nextMonth.getFullYear(), 
            nextMonth.getMonth(), 
            Math.min(daysCountInNextMonth, finalBeginDate.getDate() + (appointment.end_date.getDate() - appointment.begin_date.getDate()))
        );

        finalExtendsToNextMonth = true;
        outOfCurrentMonth = true;
    } else {
        // Calculate if the appointment extends into the previous month
        if (newStartDatePos < dateColumnsStart) {
            const startLoss = dateColumnsStart - newStartDatePos;
            const date = daysCountInPrevMonth - startLoss;

            if (appointment.extendsToPreviousMonth) {
                finalBeginDate = new LVDate(
                    prevMonth.getFullYear(), 
                    prevMonth.getMonth(), 
                    Math.max(1, date)
                );
            } else {
                finalBeginDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                    newStartDatePos, 
                    currentDate, 
                    config
                );
            }
            
            finalExtendsToPreviousMonth = true;
        } else {
            finalBeginDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                newStartDatePos, 
                currentDate, 
                config
            );
            finalExtendsToPreviousMonth = false;
        }

        // Calculate if the appointment extends into the next month
        if (newEndDatePos > dateColumnsEnd) {
            const endLoss = newEndDatePos - dateColumnsEnd;

            if (appointment.extendsToNextMonth) {
                finalEndDate = new LVDate(
                    nextMonth.getFullYear(), 
                    nextMonth.getMonth(), 
                    Math.min(daysCountInNextMonth, endLoss)
                );
            } else {
                finalEndDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                    newEndDatePos, 
                    currentDate, 
                    config
                );
            }

            finalExtendsToNextMonth = true;
        } else {
            finalEndDate = dragTableUtilities.getDateBasedOnLayoutPosition(
                newEndDatePos, 
                currentDate, 
                config
            );
            finalExtendsToNextMonth = false;
        }
    }

    // Handle dragging back into the current month from previous month
    if (appointment.extendsToPreviousMonth && newStartDatePos >= dateColumnsStart) {
        const startGains = daysCountInPrevMonth - appointment.begin_date.getDate();

        const beginDate = newStartDatePos - dateColumnsStart - startGains;
        const endDate = newStartDatePos - dateColumnsStart + appointment.end_date.getDate();

        if (beginDate + 1 < 1) {
            finalBeginDate = new LVDate(
                prevMonth.getFullYear(), 
                prevMonth.getMonth(), 
                daysCountInPrevMonth + beginDate
            );
            finalExtendsToPreviousMonth = true;
        } else {
            finalBeginDate = new LVDate(
                currentDate.getFullYear(), 
                currentDate.getMonth(), 
                beginDate + 1
            );
            finalExtendsToPreviousMonth = false;
        }

        if (endDate <= 0) {
            finalEndDate = new LVDate(
                prevMonth.getFullYear(), 
                prevMonth.getMonth(), 
                daysCountInPrevMonth + endDate
            );
            finalExtendsToPreviousMonth = true;
        } else {
            finalEndDate = new LVDate(
                currentDate.getFullYear(), 
                currentDate.getMonth(), 
                endDate
            );
        }
    }

    // Handle dragging further into the previous month
    if (appointment.extendsToPreviousMonth && newStartDatePos < dateColumnsStart) {
        const additionalDrag = dateColumnsStart - newStartDatePos;
        const newBeginDateInPrevMonth = appointment.begin_date.getDate() - additionalDrag;

        finalBeginDate = new LVDate(
            prevMonth.getFullYear(), 
            prevMonth.getMonth(), 
            Math.max(1, newBeginDateInPrevMonth)
        );
    }

    // Handle dragging back into the current month but still extending into the next month
    if (appointment.extendsToNextMonth && newEndDatePos <= dateColumnsEnd) {
        const daysDraggedIntoCurrentMonth = dateColumnsEnd - newEndDatePos;
        const remainingDaysInNextMonth = appointment.end_date.getDate() - daysDraggedIntoCurrentMonth;

        finalBeginDate = dragTableUtilities.getDateBasedOnLayoutPosition(
            newStartDatePos, 
            currentDate, 
            config
        );

        if (remainingDaysInNextMonth > 0) {
            finalEndDate = new LVDate(
                nextMonth.getFullYear(), 
                nextMonth.getMonth(), 
                remainingDaysInNextMonth
            );
            finalExtendsToNextMonth = true;
        } else {
            finalEndDate = new LVDate(
                currentDate.getFullYear(), 
                currentDate.getMonth(), 
                daysCountInCurrentMonth + remainingDaysInNextMonth
            );
            finalExtendsToNextMonth = false;
        }
    }

    // Handle dragging further into the next month
    if (appointment.extendsToNextMonth && newEndDatePos > dateColumnsEnd) {
        const additionalDrag = newEndDatePos - dateColumnsEnd;
        const newEndDateInNextMonth = appointment.end_date.getDate() + additionalDrag;

        finalEndDate = new LVDate(
            nextMonth.getFullYear(), 
            nextMonth.getMonth(), 
            Math.min(daysCountInNextMonth, newEndDateInNextMonth)
        );
    }

    // Calculate the new start and end positions (x and w) based on the resulting start and end dates
    const adjustedStartDatePos = dragTableUtilities.getPositionBasedOnDate(
        finalBeginDate, 
        currentDate, 
        config
    );
    const adjustedEndDatePos = dragTableUtilities.getPositionBasedOnDate(
        finalEndDate, 
        currentDate, 
        config
    );

    return {
        finalBeginDate,
        finalEndDate,
        finalExtendsToPreviousMonth,
        finalExtendsToNextMonth,
        adjustedStartDatePos,
        adjustedEndDatePos,
        outOfCurrentMonth
    };
}

export {
    calculateAppointmentUpdates
};
