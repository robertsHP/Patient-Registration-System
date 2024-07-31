import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../routes/routes.jsx';

import SessionService from '../services/SessionService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const sessionData = await SessionService.getSession('userId');
                if (sessionData && sessionData.userId) {
                    setUser({ userId: sessionData.userId });
                }
            } catch (error) {
                console.error('Failed to initialize user session:', error);
            }
        };

        initializeUser();
    }, []);

    const loggedIn = () => {

    };

    const login = async (userId) => {
        try {
            await SessionService.updateSession('userId', userId);
            setUser({ userId });
            navigate('/system/calendar'); // Redirect to the first subpage
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    const logout = async () => {
        try {
            await SessionService.deleteSession('userId');
            setUser(null);
            navigate(routes.login.url);
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
