
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from '../../components/Header.jsx';

import useNavigation from '../../hooks/useNavigation.jsx';
import routes from '../../routes/routes.jsx';

import SearchPage from './subPages/SearchPage.jsx';

import './CalendarPage.css';

function Test() {
    return <div>TEST</div>;
}

export default function CalendarPage() {
    const { redirect } = useNavigation();
    const subPages = routes.system.pages.calendar.subPages;

    useEffect(() => {
        console.log('Redirect called');
        redirect();
    }, [redirect]);

    return (
        <div className="page-container">
            <Header subPages={subPages} />
            <main>
                <Routes>
                    {Object.entries(subPages).map(([key, { title, url, component: Component }]) => (
                        <Route 
                            key={`${key}_route`} 
                            path={url} 
                            element={<Component />} 
                        />
                    ))}
                </Routes>
                <div>TEST</div>
            </main>
        </div>
    );
}