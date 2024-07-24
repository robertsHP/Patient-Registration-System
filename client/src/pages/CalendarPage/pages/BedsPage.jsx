import React, { useState, useEffect } from 'react';

import useDataFetch from './hooks/useDataFetch.jsx';

import EventTable from './components/EventTable/EventTable.jsx';

import CalendarTable from './components/CalendarTable.jsx';

import LVDate from '../../../models/LVDate.jsx';

import './Page.css';

export default function BedsPage () {
    const data = useDataFetch(0, new LVDate(2024, 5, 1));

    return (
        <>
            {/* <CalendarTable /> */}
            <EventTable data={data} />
        </>
    );
}

