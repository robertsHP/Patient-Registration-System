import React, { useState } from 'react';
import { useNavigate, Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import './LoginPage.css'

export default function LoginPage ({pages}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
  
    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform login logic here
        console.log('Username:', username);
        console.log('Password:', password);

        navigate(`/${pages[0].urlName}`);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input type="submit" value="Login" />
                </form>
                <Routes>
                    <Route path="*" element={<Navigate to={``} replace />} />
                </Routes>
            </div>
        </div>
    );
}
