import React, { useState, useEffect } from 'react';

import useDragTableDataFetch from './hooks/useDragTableDataFetch.jsx';

import DragTable from './components/DragTable/DragTable.jsx';

import LVDate from '../../../models/LVDate.jsx';

import './Page.css';

export default function BedsPage () {
    const data = useDragTableDataFetch(0, new LVDate(2024, 8, 1));

    return (
        <>
            <DragTable data={data} />
        </>
    );
}

