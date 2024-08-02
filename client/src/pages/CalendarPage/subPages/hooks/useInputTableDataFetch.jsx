import React, { useEffect, useState, useContext } from 'react';

import ApiService from '../../../../services/ApiService';

// import {
//     convertAppointmentForLayoutSupport
// } from '../utils/dragTableConversionUtilities';

export default function useInputTableDataFetch(tempDate) {
    const [date, setDate] = useState(tempDate);
    const [appointments, setAppointments] = useState(null);

    const [fullDataUpdateTrigger, setFullDataUpdateTrigger] = useState(0);
    const triggerFullDataUpdate = () => {
        setFullDataUpdateTrigger(prev => prev + 1);
    };

    const [singleDataUpdateTrigger, setSingleDataUpdateTrigger] = useState(0);
    const triggerSingleDataUpdate = () => {
        setSingleDataUpdateTrigger(prev => prev + 1);
    };

    const loadAppointments = async (tempDate) => {
        const params = `year=${tempDate.getFullYear()}&month=${tempDate.getMonth()}`;
        try {
            const result = await ApiService.get(
                `/api/calendar-page/input-table/get-appointments?${params}`
            );

            const data = result.data[0].events;
    
            setAppointments(data);
            triggerFullDataUpdate();
        } catch (error) {
            console.log("loadEvents error: ");
            console.log(error);
        }
    };

    const getAppointmentWithID = (id) => {
        return appointments.find(appointment => appointment.id == id);
    };

    const setAppointmentWithID = (id, appointment) => {
        setAppointments(appointments.map(
            r => r.id == id ? appointment : r
        ));
        triggerSingleDataUpdate();
    };

    const removeAppointmentWithID = (id) => {
        setRooms(prevAppointments => prevAppointments.filter(
            appointment => appointment.id !== id
        ));
        triggerSingleDataUpdate();
    };

    const refreshAppointments = () => {
        loadAppointments(date);
    };

    useEffect(() => {
        loadAppointments(date);
    }, [date]);

    return { 
        date, setDate,
        appointments, setAppointments,

        fullDataUpdateTrigger,
        singleDataUpdateTrigger,

        getAppointmentWithID, setAppointmentWithID, removeAppointmentWithID,

        refreshAppointments
    };
}
