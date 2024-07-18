import React, { useState } from 'react';
import { useNavigate, Route, Routes, Link, Navigate } from 'react-router-dom';

import ApiService from '../../services/ApiService';

import './LoginPage.css';

export default function LoginPage({ pages }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const adminUser = {
            username: 'admin',
            password: 'admin'
        };

        if (username === adminUser.username && password === adminUser.password) {
            navigate(`/${pages[0].urlName}`);
        } else {
            setError('Nepareizs lietotājvārds vai parole');
        }
    };

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     try {
    //         const response = await ApiService.post('/api/admin/authenticate', { username, password });

    //         if (response.success) {
    //             navigate(`/${page[0].urlName}`);
    //         } else {
    //             setError('Nepareizs lietotājvārds vai parole');
    //         }
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // };

    return (
        <div className="login-page">
            <div className="login-container">
                <h4>ADMIN PANELIS</h4>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="username">Lietotājvārds:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label htmlFor="password">Parole:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}

                    <div className="extra-links">
                        <Link to="/register">Reģistrēties</Link>
                        <Link to="/forgot-password">Aizmirsi paroli?</Link>
                    </div>
                    <br/>
                    <input className="login-button" type="submit" value="Pieslēgties" />
                </form>
                <Routes>
                    <Route path="*" element={<Navigate to="" replace />} />
                </Routes>
            </div>
        </div>
    );
}
