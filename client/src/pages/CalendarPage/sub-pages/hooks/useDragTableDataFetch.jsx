import React, { useEffect, useState, useContext } from 'react';

import ApiService from '../../../../services/ApiService';

import {
    convertAppointmentForLayoutSupport
} from '../utils/dragTableConversionUtilities'

export default function useDragTableDataFetch(floorID, tempDate) {
    const [date, setDate] = useState(tempDate);
    const [rooms, setRooms] = useState(null);

    const [fullDataUpdateTrigger, setFullDataUpdateTrigger] = useState(0);
    const triggerFullDataUpdate = () => {
        setFullDataUpdateTrigger(prev => prev + 1);
    };

    const [singleDataUpdateTrigger, setSingleDataUpdateTrigger] = useState(0);
    const triggerSingleDataUpdate = () => {
        setSingleDataUpdateTrigger(prev => prev + 1);
    };

    const convertRoomDataToLayout = (curRooms) => {
        if (!curRooms) {
            return;
        }
        const newRooms = curRooms.map((room) => ({
            ...room,
            appointments: room.appointments.map(appointment => (
                convertAppointmentForLayoutSupport(appointment, date)
            ))
        }));
        return newRooms;
    };

    const loadRooms = async (tempDate) => {
        const params = `floorId=${floorID}&year=${tempDate.getFullYear()}&month=${tempDate.getMonth()}`;
        try {
            const result = await ApiService.get(`/api/calendar-page/drag-table/get-rooms?${params}`);

            const data = result.data[0].rooms;
            const finalData = convertRoomDataToLayout(data);
    
            setRooms(finalData);
            triggerFullDataUpdate();
        } catch (error) {
            console.log("useDataFetch error: ");
            console.log(error);
        }
    };

    const refreshRooms = () => {
        loadRooms(date);
    };

    const getRoomWithID = (id) => {
        return rooms.find(room => room.id == id);
    };

    const setRoomWithID = (id, room) => {
        setRooms(rooms.map(r => r.id == id ? room : r));
        triggerSingleDataUpdate();
    };

    const removeRoomWithID = (id) => {
        setRooms(prevRooms => prevRooms.filter(room => room.id !== id));
        triggerSingleDataUpdate();
    };

    const getAppointmentWithID = (roomID, appointmentID) => {
        const room = getRoomWithID(roomID);
        if (!room) {
            return null;
        }
        return room.appointments.find(appointment => appointment.id == appointmentID);
    };

    const setAppointmentWithID = (roomID, appointment) => {
        const room = getRoomWithID(roomID);
        if (!room) {
            return;
        }
        setRoomWithID(roomID, {
            ...room,
            appointments: room.appointments.map(e => e.id == id ? appointment : e)
        });
        triggerSingleDataUpdate();
    };

    const removeAppointmentWithID = (roomID, appointmentID) => {
        const room = getRoomWithID(roomID);
        if (!room) {
            return;
        }
        setRoomWithID(roomID, {
            ...room,
            appointments: room.appointments.filter(e => e.id !== appointmentID)
        });
        triggerSingleDataUpdate();
    };

    useEffect(() => {
        loadRooms(date);
    }, [date]);

    return { 
        date, setDate,

        fullDataUpdateTrigger, singleDataUpdateTrigger,

        rooms, setRooms,
        loadRooms, refreshRooms,

        getRoomWithID, setRoomWithID, removeRoomWithID,
        getAppointmentWithID, setAppointmentWithID, removeAppointmentWithID
    };
}
