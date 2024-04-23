import React, { useState } from 'react';
import { Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import HeaderSelectComponent from '../../components/HeaderSelectComponent.jsx';

import Sidebar from '../../components/Sidebar.jsx';
import BedsPage from './pages/BedsData.jsx';

import './CalendarPage.css'

export default function CalendarPage ({pages}) {
    const subPages = [
        {
            title: "Gultas",
            urlName: "beds",
            component: BedsPage
        }
    ];

    const logoutOnClick = () => {
        // Add your logout logic here
        console.log('Logging out...');
    };

    return (
        <div className="main-container">
            <div className="container">
                <div className="container-left">
                    <Sidebar pages={pages}/>
                    {subPages.map(({urlName, title}) => (
                        <Link key={`${urlName}_link_button`} to={`/${urlName}`}>
                            <button className="vertical-button">{title}</button>
                        </Link>
                    ))}
                </div>
                <div className="container-right">
                    <button className="logout-button" onClick={logoutOnClick}>Iziet</button>
                </div>
            </div>
            <Routes>
                {subPages.map(({urlName, component: Component}) => (
                    <Route key={`${urlName}_route`} path={`/${urlName}/*`} element={
                        <Component />
                    } />
                ))}
                <Route path="*" element={<Navigate to={`${subPages[0].urlName}`} replace />} />
            </Routes>
        </div>
    );
}
