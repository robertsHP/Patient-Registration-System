import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useDragTableDataFetch from './hooks/useDragTableDataFetch.jsx';
import useTableConfigurations from './hooks/useTableConfigurations.jsx';

import DragTable from './components/DragTable/DragTable.jsx';
import LVDate from '../../../models/LVDate.jsx';

import { getDaysOfMonth } from './utils/monthUtilities.jsx';

export default function BedsPage () {
    const params = useParams();

    // if (params.year && params.month) {
    //     return null;
    // }

    const date = new LVDate(2024, 8, 1);

    const config = useTableConfigurations(date);
    const data = useDragTableDataFetch(0, date, config);

    return (
        <>
            <DragTable 
                data={data} 
                config={config}
            />
        </>
    );
}

