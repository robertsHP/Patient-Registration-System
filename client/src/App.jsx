import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import './App.css';

export default function App() {
    const pages = [
        {
            title: "Kalendārs",
            urlName: "calendar",
            component: CalendarPage
        }
    ];

    return (
        <>
            <div className="app">
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage pages={pages} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        {pages.map((page) => (
                            <Route
                                key={page.urlName}
                                path={`/${page.urlName}/*`}
                                element={
                                    <PrivateRoute
                                        element={page.component}
                                        sidebarPages={pages}
                                        parentUrlName={page.urlName}
                                    />
                                }
                            />
                        ))}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Router>
            </div>
        </>
    );
}
