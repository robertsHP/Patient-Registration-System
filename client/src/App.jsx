import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import routes from './routes/routes.jsx'; // Ensure this is correctly structured
import AuthService from './services/AuthService.js'; // Ensure this service has the ifLoggedOut method

import './App.css';

export default function App() {
    const [loggedOut, setLoggedOut] = useState(null);

    useEffect(() => {
        const getLoggedOut = async () => {
            try {
                const response = await AuthService.ifLoggedOut();
                setLoggedOut(response.loggedOut);
            } catch (error) {
                console.error(error.message);
            }
        };

        getLoggedOut();

        console.log(Object.values(routes.system.pages.calendar.subPages)[0].url);
    }, []);

    if (loggedOut === null) {
        return <div>Loading...</div>; // Or a spinner/loading indicator
    }

    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path={routes.login.url} element={routes.login.component} />
                    <Route path={routes.register.url} element={routes.register.component} />
                    {!loggedOut ? (
                        <>
                            {Object.entries(routes.system.pages).map(([key, page]) => (
                                <Route 
                                    key={key} 
                                    path={Object.values(page.subPages)[0].url} 
                                    element={page.component} 
                                />
                            ))}
                            <Route path="*" element={<Navigate to={routes.system.mainUrl} replace />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to={routes.login.url} replace />} />
                    )}
                </Routes>
            </Router>
        </div>
    );
}
