import React, { useState, useEffect } from 'react';

// import useNavigation from '../../../hooks/useNavigation.jsx'; // Adjust the import path
import useInputTableDataFetch from './hooks/useInputTableDataFetch.jsx';
import useDateRedirectHook from './hooks/useDateRedirectHook.jsx';

import InputTable from './components/InputTable/InputTable.jsx';

import LVDate from '../../../models/LVDate.jsx';

export default function SaunaPage() {
    const { year, month } = useDateRedirectHook();

    const date = new LVDate(year, month, 1);
    const data = useInputTableDataFetch(date);

    return (
        <>
            <InputTable 
                data={data}
            />
        </>
    );
}
