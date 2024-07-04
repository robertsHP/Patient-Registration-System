import React, { useEffect, useState } from 'react';

import ApiService from '../../../../services/ApiService';

import Event from '../models/Event.jsx';
import Room from '../models/Room.jsx';
import DataStorage from '../models/DataStorage.jsx';

export default function useDataFetch (floorID, tempDate) {
    const [date, setDate] = useState(tempDate);
    const [data, setData] = useState(tempDate);

    useEffect(() => {
        var params = `?floorId=${floorID}&year=${date.getFullYear()}&month=${date.getMonth() + 1}`;

        ApiService.get('/api/calendar-page/events/by-date'+params)
        .then(result => {
            setData(result.data);
        })
        .catch(error => {
            console.error('Failed to get data in useDataFetch - ' + error);
        });
    }, [floorID, date]);

    return { 
        date, setDate,
        data, setData
    };
}


