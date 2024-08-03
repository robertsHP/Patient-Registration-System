import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useInputTableDataFetch from './hooks/useInputTableDataFetch.jsx';
import InputTable from './components/InputTable/InputTable.jsx';
import LVDate from '../../../models/LVDate.jsx';

import './Page.css';

export default function SaunaPage () {
    const params = useParams();

    // if (params.year && params.month) {
    //     //ielikt šodienas datumu
    // }

    const data = useInputTableDataFetch(new LVDate(2024, 8, 1));

    return (
        <>
            <InputTable 
                data={data}
            />
        </>
    );
}

