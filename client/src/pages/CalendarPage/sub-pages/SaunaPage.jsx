import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import useNavigation from '../../../hooks/useNavigation.jsx'; // Adjust the import path
import useInputTableDataFetch from './hooks/useInputTableDataFetch.jsx';

import InputTable from './components/InputTable/InputTable.jsx';

import LVDate from '../../../models/LVDate.jsx';

export default function SaunaPage() {
    const { navigateTo, currentPath } = useNavigation();
    const location = useLocation();
    
    // Initialize queryParams once
    const [queryParams, setQueryParams] = useState(() => new URLSearchParams(location.search));
    
    // Extract year and month from queryParams
    const year = queryParams.get('year');
    const month = queryParams.get('month');
    
    useEffect(() => {
        // Perform URL adjustment only if year or month are missing
        if (year === null || month === null) {
            const newUrlPathWithoutParams = currentPath.split('?')[0];

            const date = new LVDate();

            const newUrlPath = `
                ${newUrlPathWithoutParams}?year=${date.getFullYear()}&month=${date.getMonth()}
            `;

            // Avoid navigation if URL is already correct
            if (location.pathname + location.search !== newUrlPath) {
                navigateTo(newUrlPath);
            }
        }
    }, [year, month]);

    // Ensure queryParams is updated when location changes
    useEffect(() => {
        setQueryParams(new URLSearchParams(location.search));
    }, [location.search]);

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
