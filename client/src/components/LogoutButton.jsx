import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Header.css'

export default function LogoutButton () {
    const navigate = useNavigate();

    const logoutOnClick = () => {
        // Add your logout logic here
        //!!!!!!!!!!!!!
        console.log('Logging out...');

        navigate(`/login`);
    };

    return (
        <>
            <button className="logout-button" onClick={logoutOnClick}>Iziet</button>
        </>
    );
}