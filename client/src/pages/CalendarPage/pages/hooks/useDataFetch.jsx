import React, { useEffect, useState } from 'react';

import ApiService from '../../../../services/ApiService';

import {
    convertEventForLayoutSupport,
    convertEventForSendingToDB
} from '../utils/conversionUtilities'

export default function useDataFetch(floorID, tempDate) {
    const [date, setDate] = useState(tempDate);
    const [rooms, setRooms] = useState(null);

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

    useEffect(() => {
        var params = `?floorId=${floorID}&year=${date.getFullYear()}&month=${date.getMonth()}`;

        ApiService.get('/api/calendar-page/rooms'+params)
        .then(result => {
            var data = result.data[0].rooms;
            var finalData = convertRoomDataToLayout(data);

            setRooms(finalData);
        });
    }, [floorID, date]);

    return { 
        date, setDate,
        rooms, setRooms,
        getRoomWithID, setRoomWithID,
        getEventWithID, setEventWithID, removeEventWithID
    };
}
