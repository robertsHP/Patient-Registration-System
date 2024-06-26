import React, { useEffect, useState } from 'react';

import ApiService from '../../../../services/ApiService';

import Event from '../models/Event.jsx';
import Room from '../models/Room.jsx';
import DataStorage from '../models/DataStorage.jsx';

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
