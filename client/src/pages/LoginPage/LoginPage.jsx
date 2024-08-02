import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import routes from '../../routes/routes.jsx';

import useNavigation from '../../hooks/useNavigation.jsx';

import SessionService from '../../services/SessionService';
import AuthService from '../../services/AuthService';

import './LoginPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { redirect } = useNavigation();

    const register = routes.auth.pages.register;

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await AuthService.login(email, password);

            if (response && typeof response === 'string') {
                setError(response);
            } else {
                redirect();
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
                    {error && 
                        <div className="error-message" style={{ color: 'red' }}>
                            {error}
                        </div>
                    }
                    <br />
                    <input className="login-button" type="submit" value="Pieslēgties" />
                </form>
                <div className="links">
                    <Link to={register.url}>Reģistrēties</Link>
                </div>
            </div>
        </div>
    );
};
