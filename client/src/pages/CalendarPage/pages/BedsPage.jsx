import React, { useState, useEffect } from 'react';

import useDataFetch from './hooks/useDataFetch.jsx';

import MouseTest from './components/MouseTest.jsx';

import EventTable from './components/EventTable/EventTable.jsx';
import GridUI from './components/GridUI/GridUI.jsx';

import './Page.css'

export default function BedsPage () {
    const data = useDataFetch(0, new Date(2024, 5, 1));

    console.log(data.rooms);

    return (
        <>
            {/* <MouseTest/> */}
            <GridUI 
                data={data} 
            />
            {data.rooms && <EventTable 
                data={data} 
            />}
        </>
    );
}