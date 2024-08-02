import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import routes from './routes/routes.jsx'; // Ensure this is correctly structured
import useNavigation from './hooks/useNavigation.jsx';


// import LoginPage from './pages/LoginPage/LoginPage.jsx';
// import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';

// import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';
// import SearchPage from './pages/CalendarPage/subPages/SearchPage.jsx';
// import BedsPage from './pages/CalendarPage/subPages/BedsPage.jsx';
// import Beds4Page from './pages/CalendarPage/subPages/Beds4Page.jsx';
// import SaunaPage from './pages/CalendarPage/subPages/SaunaPage.jsx';


import './App.css';

export default function App() {
    const { redirect } = useNavigation();

    useEffect(() => {
        redirect();
    }, []);

    const login = routes.auth.pages.login;
    const register = routes.auth.pages.register;

    return (
        <div className="app">
            <Routes>
                <Route path={login.url} element={<login.component/>} />
                <Route path={register.url} element={<register.component/>} />
                {Object.entries(routes.system.pages).map(([key, page]) => (
                    <Route 
                        key={`${key}_route`} 
                        path={page.url+'/*'} 
                        element={<page.component />} 
                    />
                ))}
            </Routes>
        </div>
    );
}

