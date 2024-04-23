import React, { useState } from 'react';
import { Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import HeaderSelectComponent from '../../components/HeaderSelectComponent.jsx';
import BedsPage from './pages/BedsData.jsx';

import './CalendarPage.css'

export default function CalendarPage ({urlName}) {
    const subPages = [{
        title: "Gultas",
        urlName: "beds",
        component: BedsPage
    }];

    return (
        <div className="main-container">
            <HeaderSelectComponent 
                subPages={subPages}
                urlName={urlName}
            />
            <Routes>
                <Route path="*" element={<Navigate to={`${subPages[0].urlName}`} replace />} />
            </Routes>
        </div>
    );
}
