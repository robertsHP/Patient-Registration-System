import React, { useState } from 'react';
import { useNavigate, Routes, Route, Navigate, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './LoginPage.css';

export default function LoginPage({ pages }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await AuthService.login(email, password);

            if (response) {
                if (typeof response === "string") {
                    setError(response);
                } else {
                    setError('');
                    // navigate(`/${pages[0].urlName}`);
                }
            } else {
                setError('Nepareizs e-pasts vai parole');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h4>CLIENT</h4>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-pasts:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Parole:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
                    <br />
                    <input className="login-button" type="submit" value="Pieslēgties" />
                </form>
                <Routes>
                    <Route path="*" element={<Navigate to={``} replace />} />
                </Routes>
                <div className="links">
                    <Link to="/register">Reģistrēties</Link>
                    <Link to="/forgot-password">Aizmirsi paroli?</Link>
                </div>
            </div>
        </div>
    );
}
