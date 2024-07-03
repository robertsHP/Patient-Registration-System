import React, { useEffect, useState } from 'react';

import ApiService from '../../../../services/ApiService';

import Event from '../models/Event.jsx';
import Room from '../models/Room.jsx';
import DataStorage from '../models/DataStorage.jsx';

export default function useDataFetch (tempFloorID, tempDate) {
    const [date, setDate] = useState(tempDate);
    const [floorID, setFloorID] = useState(tempFloorID);


    var params = `?floorId=${floorID}&year=${date.getFullYear()}&month=${date.getMonth() + 1}`;
    var result = ApiService.get('/api/calendar-page/events/by-date'+params);

    console.log(result);

    return { 
        date, setDate
    };
}
