import React, { useState, useEffect } from 'react';

import { Route, Routes, Link, Navigate } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';

// import '../../../global.css'
import './HeaderSelectComponent.css'

export default function HeaderSelectComponent({subPages, urlName}) {
    const [path, setPath] = useState(`/${subPages[0].urlName}`);

    const sidebarButton = () => {
        // Add your logout logic here
        console.log('Logging out...');
    };

    const logoutButton = () => {
        // Add your logout logic here
        console.log('Logging out...');
    };

    return (
        <>
            <div className="container">
                <div className="container-left">
                    <button className="sidebar-button" onClick={sidebarButton}>...</button>
                    {subPages.map(({urlName, title}) => (
                        <Link key={`${urlName}_link_button`} to={`/${urlName}`}>
                            <button className="vertical-button">{title}</button>
                        </Link>
                    ))}
                </div>
                <div className="container-right">
                    <button className="logout-button" onClick={logoutButton}>Iziet</button>
                </div>
            </div>
            <Routes>
                {subPages.map(({urlName, component: Component}) => (
                    <Route key={`${urlName}_route`} path={`/${urlName}/*`} element={
                        <Component />
                    } />
                ))}
            </Routes>
        </>
    );
}

