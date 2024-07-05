import React, { useState, useEffect } from 'react';

import useDataFetch from './hooks/useDataFetch.jsx';

import EventGrid from './components/EventGrid.jsx';
import GridUI from './components/GridUI.jsx';

import './Page.css'

export default function BedsPage () {
    const {
        date, setDate,
        data, setData
    } = useDataFetch(1, new Date(2024, 5, 1));


    console.log(data);

    return (
        <>
            {/* <GridUI 
                date={date}
                setDate={setDate}
                data={data}
                setData={setData}
            />
            <EventGrid 
                date={date}
                setDate={setDate}
                data={data}
                setData={setData}
            />  */}
        </>
    );
}