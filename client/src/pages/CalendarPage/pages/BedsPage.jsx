import React, { useState, useEffect } from 'react';

import useDataFetch from './hooks/useDataFetch.jsx';

import EventGrid from './components/EventGrid/EventGrid.jsx';
import GridUI from './components/GridUI.jsx';

import './Page.css'

export default function BedsPage ({pages, page}) {
    const {
        date, setDate,
        dataStorage, setDataStorage
    } = useDataFetch();

    return (
        <>
            <GridUI 
                date={date}
            />
            <EventGrid 
                date={date}
            /> 
        </>
    );
}