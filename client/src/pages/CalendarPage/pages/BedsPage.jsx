import React, { useState, useEffect } from 'react';

import useDataFetch from './hooks/useDataFetch.jsx';

import MouseTest from './components/MouseTest.jsx';

import EventTable from './components/EventTable/EventTable.jsx';
import GridUI from './components/GridUI/GridUI.jsx';

import './Page.css'

export default function BedsPage () {
    const {
        date, setDate,
        rooms, setRooms
    } = useDataFetch(0, new Date(2024, 5, 1));

    console.log(rooms);

    return (
        <>
            {/* <MouseTest/> */}
            <GridUI 
                date={date}
                setDate={setDate}
                rooms={rooms}
                setRooms={setRooms}
            />
            {rooms && <EventTable 
                date={date}
                setDate={setDate}
                rooms={rooms}
                setRooms={setRooms}
            />}
        </>
    );
}