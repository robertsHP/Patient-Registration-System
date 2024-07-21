import React, { useState } from 'react';
import { useNavigate, Route, Routes, Link, Navigate } from 'react-router-dom';

import Header from '../../components/Header.jsx';

import BedsPage from './pages/BedsPage.jsx';
import Beds4Page from './pages/Beds4Page.jsx';
import SaunaPage from './pages/SaunaPage.jsx';

import './CalendarPage.css'

export default function CalendarPage ({sidebarPages, parentUrlName}) {
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
    const [currentSubPageNum, setCurrentSubPageNum] = useState(0);

    return (
        <div className="page-container">
            <Header 
                sidebarPages={sidebarPages} 
                parentUrlName={parentUrlName} 
                subPages={subPages}
                currentSubPageNum={currentSubPageNum}
                setCurrentSubPageNum={setCurrentSubPageNum}
            />
            <main>
                <Routes>
                    {subPages.map(({urlName, component: Component}) => (
                        <Route 
                            key={`${urlName}_route`} 
                            path={`/${urlName}/*`} 
                            element={<Component />} 
                        />
                    ))}
                    <Route path="*" element={<Navigate to={`${subPages[currentSubPageNum].urlName}`} replace />} />
                </Routes>
            </main>
        </div>
    );
}
