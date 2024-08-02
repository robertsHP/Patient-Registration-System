import React, { useEffect, useState } from 'react';
import { useNavigate, Route, Routes, Link, Navigate } from 'react-router-dom';

import Header from '../../components/Header.jsx';

import routes from '../../routes/routes.jsx';

import './CalendarPage.css';

export default function CalendarPage () {
    const [currentSubPageNum, setCurrentSubPageNum] = useState(0);

    const setSubPage = (num) => {
        setCurrentSubPageNum(num);
    };

    useEffect(() => {
        console.log('WORK');
    });

    var calendar = routes.system.pages.calendar;

    return (
        <div className="page-container">
            <Header 
                sidebarPages={routes.system.pages} 
                parentUrlName={routes.system.pages.calendar.url} 
                subPages={routes.system.pages.calendar.subPages}
                currentSubPageNum={currentSubPageNum}
                setCurrentSubPageNum={setCurrentSubPageNum}
            />
            <main>
                <Routes>
                    {Object.entries(calendar.subPages).map(([key, page]) => (
                        <Route 
                            key={`${key}_route`} 
                            path={page.url} 
                            element={page.component} 
                        />
                    ))}
                </Routes>
                <Navigate to={routes.system.mainUrl} replace />
            </main>
        </div>
    );
}
