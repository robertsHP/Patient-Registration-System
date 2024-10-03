import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useNavigation from '../hooks/useNavigation.jsx';
import routes from '../routes/routes.jsx';
import AuthService from '../services/AuthService.jsx';

import './LogoutButton.css'

export default function LogoutButton () {
    const { redirect } = useNavigation();

    const logoutOnClick = () => {
        const logout = async () => {
            try {
                await AuthService.logout();
                redirect();
            } catch (error) {
                console.error(error.message);
            }
        };

        logout();
    };

    return (
        <>
            <button className="logout-button" onClick={logoutOnClick}>Iziet</button>
        </>
    );
}
