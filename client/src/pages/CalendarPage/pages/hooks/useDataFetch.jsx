import React, { useEffect, useState } from 'react';

import ApiService from '../../../../services/ApiService';

import Event from '../models/Event.jsx';
import Room from '../models/Room.jsx';
import DataStorage from '../models/DataStorage.jsx';

const transformEvents = (eventsData) => {
    const events = [];
    Object.entries(eventsData).forEach(([id, details]) => {
        const [room, patientName, start, end] = details;
        const newEvent = new Event(parseInt(id, 10), room, patientName, start, end);
        events.push(newEvent);
    });
    return events;
};

const transformRooms = (roomsData) => {
    const rooms = [];
    Object.entries(roomsData).forEach(([id, details]) => {
        const [number, beds] = details;
        const newRoom = new Room(parseInt(id, 10), number, beds);
        rooms.push(newRoom);
    });
    return rooms;
};

export default function useDataFetch (tableName) {
    const [date, setDate] = useState(new Date ());

    const [dataStorage, setDataStorage] = useState(new DataStorage());
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);

                const [eventsResponse, roomsResponse] = await Promise.all([
                    ApiService.get('/api/'+tableName),
                    ApiService.get('/api/room')
                ]);

                const eventsList = Object.values(eventsResponse);
                const roomsList = Object.values(roomsResponse);

                const storage = new DataStorage();
                storage.addEvents(eventsList);
                storage.addRooms(roomsList);

                setDataStorage(storage);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();

        if (error) {
            console.error('Error:' + error);
        }
    }, []);

    return { 
        date, setDate,
        dataStorage, setDataStorage
    };
}
