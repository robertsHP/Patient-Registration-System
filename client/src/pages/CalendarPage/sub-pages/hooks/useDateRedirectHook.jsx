import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';

import LVDate from '../../../../models/LVDate.jsx';

import useNavigation from '../../../../hooks/useNavigation.jsx';

export default function useDateRedirectHook () {
    const { navigateTo, currentPath } = useNavigation();
    const location = useLocation();

    // Initialize queryParams once
    const [queryParams, setQueryParams] = useState(() => new URLSearchParams(location.search));

    var year = queryParams.get('year');
    var month = queryParams.get('month');

    // Perform URL adjustment only if year or month are missing
    if (year === null || month === null) {
        const newUrlPathWithoutParams = currentPath.split('?')[0];
        const date = new LVDate();

        year = date.getFullYear();
        month = date.getMonth();

        queryParams.set('year', year);
        queryParams.set('month', month);

        var newUrlPath = `
            ${newUrlPathWithoutParams}?year=${year}&month=${month}
        `;
        newUrlPath = newUrlPath.trim();

        // Avoid navigation if URL is already correct
        if (location.pathname + location.search !== newUrlPath) {
            navigateTo(newUrlPath);
        }
    }

    // Ensure queryParams is updated when location changes
    useEffect(() => {
        setQueryParams(new URLSearchParams(location.search));
    }, [location.search]);

    return { 
        year, month
    };
}
