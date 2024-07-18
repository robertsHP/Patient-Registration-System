import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await ApiService.post('/api/admin/forgot-password', { email });

            if (response.success) {
                setMessage('Paroles atiestatīšanas instrukcija ir nosūtīta uz jūsu e-pastu.');
            } else {
                setError('E-pasts nav atrasts.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <h4>Aizmirsi paroli?</h4>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-pasts:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
                    {message && <div className="message" style={{color: 'green'}}>{message}</div>}
                    <br/>
                    <input className="forgot-password-button" type="submit" value="Nosūtīt" />
                </form>
                <button className="back-button" onClick={() => navigate('/login')}>Atpakaļ</button>
            </div>
        </div>
    );
}
