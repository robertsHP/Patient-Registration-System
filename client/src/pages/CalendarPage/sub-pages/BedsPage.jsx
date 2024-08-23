import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import useDragTableDataFetch from './hooks/useDragTableDataFetch.jsx';
import useTableConfigurations from './hooks/useTableConfigurations.jsx';

import DragTable from './components/DragTable/DragTable.jsx';
import LVDate from '../../../models/LVDate.jsx';

import useNavigation from '../../../hooks/useNavigation.jsx';

export default function BedsPage () {
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
    const config = useTableConfigurations(date);
    const data = useDragTableDataFetch(0, date, config);

    return (
        <>
            <DragTable 
                data={data} 
                config={config}
                queryParams={queryParams}
            />
        </>
    );
}
