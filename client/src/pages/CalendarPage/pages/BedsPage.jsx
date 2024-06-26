import React, { useState, useEffect } from 'react';

import useDataFetch from './hooks/useDataFetch.jsx';

import EventGrid from './components/EventGrid/EventGrid.jsx';
import GridUI from './components/GridUI.jsx';

import './Page.css'

export default function BedsPage () {
    const {
        date, setDate,
        dataStorage, setDataStorage
    } = useDataFetch("beds");

    console.log(dataStorage.getEvents());

    return (
        <>
            <GridUI 
                date={date}
                setDate={setDate}
                dataStorage={dataStorage}
                setDataStorage={setDataStorage}
            />
            <EventGrid 
                date={date}
                setDate={setDate}
                dataStorage={dataStorage}
                setDataStorage={setDataStorage}
            /> 
        </>
    );
}