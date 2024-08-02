import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import routes from './routes/routes.jsx'; // Ensure this is correctly structured
import useNavigation from './hooks/useNavigation.jsx';

import './App.css';

export default function App() {
    const { redirect } = useNavigation();

    useEffect(() => {
        redirect();
    }, []);

    return (
        <div className="app">
            <Routes>
                <Route path={routes.auth.login.url} element={routes.auth.login.component} />
                <Route path={routes.auth.register.url} element={routes.auth.register.component} />
                {Object.entries(routes.system.pages).map(([key, page]) => (
                    <Route 
                        key={key} 
                        path={Object.values(page.subPages)[0].url} 
                        element={page.component} 
                    />
                ))}
            </Routes>
        </div>
    );
}

