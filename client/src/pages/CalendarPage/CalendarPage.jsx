import React, { useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import Header from '../../components/Header.jsx';
import useNavigation from '../../hooks/useNavigation.jsx';
import routes from '../../routes/routes.jsx';

import './CalendarPage.css';

export default function CalendarPage() {
    const { redirect } = useNavigation();
    const calendar = routes.system.pages.calendar;

    useEffect(() => {
        console.log('Redirect called');
        redirect();
    }, [redirect]);

    return (
        <div className="page-container">
            <Header
                mainPageUrl={calendar.url} 
                subPages={calendar.subPages} 
            />
            <main>
                <Routes>
                    {Object.entries(calendar.subPages).map(([key, { title, url, component: Component }]) => (
                        <Route 
                            key={`${key}_route`} 
                            path={url} 
                            element={<Component />} 
                        />
                    ))}
                </Routes>
                <Outlet />
            </main>
        </div>
    );
}
