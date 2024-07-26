import React, { useState, useEffect } from 'react';

import useDataFetch from './hooks/useDataFetch.jsx';

import InputTable from './components/InputTable/InputTable.jsx';

import LVDate from '../../../models/LVDate.jsx';

import './Page.css';

export default function SaunaPage () {
    // const data = useDataFetch(0, new LVDate(2024, 6, 1));
    const date = new LVDate(2024, 6, 1);



    return (
        <>
            {/* <InputTable 
                // data={data}
                year={date.getFullYear()}
                month={date.getMonth()} 
            /> */}
        </>
    );
}

