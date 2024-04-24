import React, { useState } from 'react';
import { Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar.jsx';

import BedsPage from './pages/BedsPage.jsx';
import Beds4Page from './pages/Beds4Page.jsx';
import SaunaPage from './pages/SaunaPage.jsx';

import './CalendarPage.css'

export default function CalendarPage ({pages, page}) {
    const subPages = [
        {
            title: "Gultas",
            urlName: "beds",
            component: BedsPage
        },
        {
            title: "Gultas 4. stāvs",
            urlName: "beds4",
            component: Beds4Page
        },
        {
            title: "Pirts",
            urlName: "sauna",
            component: SaunaPage
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
                        <Link key={`${urlName}_link_button`} to={`/${page.urlName}/${urlName}`}>
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
