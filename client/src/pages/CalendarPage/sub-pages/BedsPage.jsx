import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useDragTableDataFetch from './hooks/useDragTableDataFetch.jsx';
import DragTable from './components/DragTable/DragTable.jsx';
import LVDate from '../../../models/LVDate.jsx';

import { getDaysOfMonth } from './utils/monthUtilities.jsx';

export default function BedsPage () {
    const params = useParams();

    // if (params.year && params.month) {
    //     return null;
    // }

    const data = useDragTableDataFetch(0, new LVDate(2024, 8, 1));

    console.log(getDaysOfMonth(data.date.getFullYear(), data.date.getMonth()).length);
    console.log(data.date.getObject());

    return (
        <>
            <DragTable data={data} />
        </>
    );
}

