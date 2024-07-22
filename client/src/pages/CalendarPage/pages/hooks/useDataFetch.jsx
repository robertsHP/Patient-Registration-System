import React, { useEffect, useState, useContext } from 'react';

import ApiService from '../../../../services/ApiService';

import {
    convertEventForLayoutSupport,
    convertEventForSendingToDB
} from '../utils/conversionUtilities'

export default function useDataFetch(floorID, tempDate) {
    const [date, setDate] = useState(tempDate);
    const [rooms, setRooms] = useState(null);

    const [dataLoadedTrigger, setDataLoadedTrigger] = useState(0);
    const triggerDataLoaded = () => {
        setDataLoadedTrigger(prev => prev + 1);
    };

    const convertRoomDataToLayout = (curRooms) => {
        if (!curRooms) {
            return;
        }
        const newRooms = curRooms.map((room) => ({
            ...room,
            events: room.events.map(event => (
                convertEventForLayoutSupport(event, date)
            ))
        }));
        return newRooms;
    };

    const loadRooms = (tempDate) => {
        const params = `?floorId=${floorID}&year=${tempDate.getFullYear()}&month=${tempDate.getMonth()}`;
        ApiService.get(`/api/calendar-page/rooms${params}`)
            .then(result => {
                const data = result.data[0].rooms;
                const finalData = convertRoomDataToLayout(data);

                console.log("LOADED ROOMS");

                setRooms(finalData);
                triggerDataLoaded();
            });
    };

    const refreshRooms = () => {
        loadRooms(date);
    };

    const getRoomWithID = (id) => {
        return rooms.find(room => room.id == id);
    };

    const setRoomWithID = (id, room) => {
        setRooms(rooms.map(r => r.id == id ? room : r));
    };

    const getEventWithID = (roomID, eventID) => {
        const room = getRoomWithID(roomID);
        if (!room) {
            return null;
        }
        return room.events.find(event => event.id == eventID);
    };

    const setEventWithID = (roomID, event) => {
        const room = getRoomWithID(roomID);
        if (!room) {
            return;
        }
        setRoomWithID(roomID, {
            ...room,
            events: room.events.map(e => e.id == id ? event : e)
        });
    };

    const removeEventWithID = (roomID, eventID) => {
        const room = getRoomWithID(roomID);
        if (!room) {
            return;
        }
        setRoomWithID(roomID, {
            ...room,
            events: room.events.filter(e => e.id !== eventID)
        });
    };

    return { 
        date, setDate,

        dataLoadedTrigger,

        rooms, setRooms,
        loadRooms, refreshRooms,

        getRoomWithID, setRoomWithID,
        getEventWithID, setEventWithID, removeEventWithID
    };
}
