import React, { useEffect, useState, useContext } from 'react';

import ApiService from '../../../../services/ApiService';

import * as dragTableUtilities from '../components/DragTable/utils/dragTableUtilities';

import useNavigation from '../../../../hooks/useNavigation.jsx';

export default function useDragTableDataFetch(tempFloorID, tempDate, config) {
    const { navigateTo, currentPath } = useNavigation();

    const [date, setDate] = useState(tempDate);
    const [rooms, setRooms] = useState(null);
    const floorID = tempFloorID;

    const [fullDataUpdateTrigger, setFullDataUpdateTrigger] = useState(0);
    const triggerFullDataUpdate = () => {
        setFullDataUpdateTrigger(prev => prev + 1);
    };

    const [singleDataUpdateTrigger, setSingleDataUpdateTrigger] = useState(0);
    const triggerSingleDataUpdate = () => {
        setSingleDataUpdateTrigger(prev => prev + 1);
    };

    const convertRoomDataToLayout = (curRooms, config) => {
        if (!curRooms) {
            return;
        }
        const newRooms = curRooms.map((room) => ({
            ...room,
            appointments: room.appointments.map(appointment => (
                dragTableUtilities.convertAppointmentForLayoutSupport(
                    appointment, 
                    date, 
                    config
                )
            ))
        }));
        return newRooms;
    };

    const loadRooms = async (tempDate, config) => {
        try {
            const params = `floorId=${floorID}&year=${tempDate.getFullYear()}&month=${tempDate.getMonth()}`;
            const result = await ApiService.get(
                `/api/calendar-page/drag-table/get-rooms?${params}`
            );

            const data = result.data[0].rooms;
            const finalData = convertRoomDataToLayout(data, config);
    
            setRooms(finalData);
            triggerFullDataUpdate();
        } catch (error) {
            console.log("useDataFetch error: ");
            console.log(error);
        }
    };

    const refreshRooms = (config) => {
        loadRooms(date, config);
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

    const setAppointmentWithID = (roomID, appointmentID, newAppointment) => {
        const room = getRoomWithID(roomID);
        if (!room) {
            return;
        }
        setRoomWithID(roomID, {
            ...room,
            appointments: room.appointments.map(
                e => e.id == appointmentID ? 
                    newAppointment 
                    : 
                    e
            )
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

    const getSumOfAllAppointmentDays = (roomID) => {
        const room = getRoomWithID(roomID);

        return room.appointments.reduce((sum, appointment) => sum + appointment.w, 0);
    };

    useEffect(() => {
        var newCurrentPath = currentPath.split('?')[0];

        newCurrentPath += `?year=${date.getFullYear()}&month=${date.getMonth()}`;
        newCurrentPath.trim();

        if(newCurrentPath !== currentPath) {
            navigateTo(newCurrentPath);
        }
        loadRooms(date, config);
    }, [date]);

    return { 
        date, setDate,

        floorID,

        fullDataUpdateTrigger, singleDataUpdateTrigger,

        rooms, setRooms,
        loadRooms, refreshRooms,

        getRoomWithID, setRoomWithID, removeRoomWithID,
        getAppointmentWithID, setAppointmentWithID, removeAppointmentWithID,

        getSumOfAllAppointmentDays
    };
}
