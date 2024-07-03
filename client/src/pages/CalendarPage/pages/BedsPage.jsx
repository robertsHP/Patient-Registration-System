import React, { useState, useEffect } from 'react';

import useEventsFetch from './hooks/useEventsFetch.jsx';

import EventGrid from './components/EventGrid.jsx';
import GridUI from './components/GridUI.jsx';

import './Page.css'

export default function BedsPage () {
    const {
        date, setDate,
        dataStorage, setDataStorage
    } = useEventsFetch(1, new Date(2024, 5, 1));








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