import React, { useState, useEffect } from 'react';

import useDataFetch from './hooks/useDataFetch.jsx';

import EventTable from './components/EventTable/EventTable.jsx';
import GridUI from './components/GridUI/GridUI.jsx';

import LVDate from '../../../models/LVDate.jsx';

import './Page.css'

export default function BedsPage () {
    const data = useDataFetch(0, new LVDate(2024, 6, 1));

    // console.log(data.rooms);

    return (
        <>
            <GridUI data={data} />
            {data.rooms && <EventTable data={data} />}
        </>
    );
}

