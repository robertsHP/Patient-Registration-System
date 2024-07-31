import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import routes from './routes/routes.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext';

import './App.css';

function AppContent() {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Routes>
                <Route path={routes.login.url} element={routes.login.component} />
                <Route path={routes.register.url} element={routes.register.component} />

                {user ? (
                    Object.entries(routes.system.pages).map(([key, page]) => (
                        <Route key={key} path={page.url} element={page.component} />
                    ))
                ) : (
                    <Route path="*" element={<Navigate to={routes.login.url} replace />} />
                )}
            </Routes>
            {!user && <Navigate to={routes.login.url} replace />}
        </>
    );
}

export default function App() {
    return (
        <div className="app">
            <Router>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </Router>
        </div>
    );
}
