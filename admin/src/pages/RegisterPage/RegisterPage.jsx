import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import './RegisterPage.css';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await ApiService.post('/api/admin/register', { username, password, email });

            if (response.success) {
                navigate('/login');
            } else {
                setError('Reģistrācija neizdevās. Mēģiniet vēlreiz.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h4>Reģistrēties</h4>
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
                    <label htmlFor="email">E-pasts:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
                    <br/>
                    <input className="register-button" type="submit" value="Reģistrēties" />
                </form>
                <button className="back-button" onClick={() => navigate('/login')}>Atpakaļ</button>
            </div>
        </div>
    );
}
