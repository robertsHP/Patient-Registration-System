import React, { useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import Header from '../../components/Header.jsx';

import useNavigation from '../../hooks/useNavigation.jsx';
import routes from '../../routes/routes.jsx';

import './CalendarPage.css';

export default function CalendarPage() {
    const { redirect } = useNavigation();

    useEffect(() => {
        redirect();
    }, []);

    const calendar = routes.system.pages.calendar;

    return (
        <div className="calendar-page">
            <Header
                mainPageUrl={calendar.url} 
                subPages={calendar.subPages} 
            />
            <main>
                <Routes>
                    {Object.entries(calendar.subPages).map(([key, page]) => {
                        return (
                            <Route 
                                key={`${key}_route`} 
                                path={page.url} 
                                element={<page.component />} 
                            />
                        );
                    })}
                </Routes>
                <Outlet />
            </main>
        </div>
    );
}
