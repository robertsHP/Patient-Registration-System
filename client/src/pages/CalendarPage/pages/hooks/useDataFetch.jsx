import React, { useEffect, useState } from 'react';

import ApiService from '../../../../services/ApiService';

export default function useDataFetch (floorID, tempDate) {
    const [date, setDate] = useState(tempDate);
    const [rooms, setRooms] = useState(null);

    useEffect(() => {
        var params = `?floorId=${floorID}&year=${date.getFullYear()}&month=${date.getMonth() + 1}`;

        ApiService.get('/api/calendar-page/table'+params)
        .then(result => {
            setRooms(result.data[0].rooms);
        })
        .catch(error => {
            console.error('Failed to get data in useDataFetch - ' + error);
        });
    }, [floorID, date]);

    return { 
        date, setDate,
        rooms, setRooms
    };
}


