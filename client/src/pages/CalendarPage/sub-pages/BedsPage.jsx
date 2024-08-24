import React, { useState, useEffect } from 'react';

import useDragTableDataFetch from './hooks/useDragTableDataFetch.jsx';
import useTableConfigurations from './hooks/useTableConfigurations.jsx';

import DragTable from './components/DragTable/DragTable.jsx';
import LVDate from '../../../models/LVDate.jsx';

import useDateRedirectHook from './hooks/useDateRedirectHook.jsx';

export default function BedsPage () {
    const { year, month } = useDateRedirectHook();

    const date = new LVDate(year, month, 1);

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
