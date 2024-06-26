import React, { useState } from 'react';
import { useNavigate, Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import './LoginPage.css'

export default function LoginPage ({pages}) {
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


    ///KAD IR ADMIN PANELIS UN LIETOTĀJU PĀRVALDĪBA GATAVA TAD INICIALIZĒ ŠO
    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     try {
    //         const response = await ApiService.post('/login', { username, password });
            
    //         if (response.success) {
    //             navigate(`/${pages[0].urlName}`);
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
                    <br/>
                    <input className="login-button" type="submit" value="Pieslēgties" />
                </form>
                <Routes>
                    <Route path="*" element={<Navigate to={``} replace />} />
                </Routes>
            </div>
        </div>
    );
}

