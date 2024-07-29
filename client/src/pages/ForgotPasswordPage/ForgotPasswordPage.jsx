import React, { useState } from 'react';

import AuthService from '../../services/AuthService';

import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await AuthService.forgotPassword(email);
            if (response) {
                setMessage('Paroles atiestatīšanas saite tika nosūtīta uz jūsu e-pastu.');
            } else {
                setError('Neizdevās nosūtīt paroles atiestatīšanas saiti');
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

                    {message && <div className="message" style={{ color: 'green' }}>{message}</div>}
                    {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
                    <br />
                    <input className="forgot-password-button" type="submit" value="Sūtīt atiestatīšanas saiti" />
                </form>
            </div>
        </div>
    );
}
