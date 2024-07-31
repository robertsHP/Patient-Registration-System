import React, { useState } from 'react';
import { useNavigate, Route, Routes, Link, Navigate } from 'react-router-dom';

import Header from '../../components/Header.jsx';

import SearchPage from './subPages/SearchPage.jsx';
import BedsPage from './subPages/BedsPage.jsx';
import Beds4Page from './subPages/Beds4Page.jsx';
import SaunaPage from './subPages/SaunaPage.jsx';

import './CalendarPage.css';

export default function CalendarPage () {
    // const subPages = [
    //     {
    //         title: "Datu meklēšana",
    //         urlName: "search",
    //         component: SearchPage
    //     },
    //     {
    //         title: "Gultas",
    //         urlName: "beds",
    //         component: BedsPage
    //     },
    //     {
    //         title: "Gultas 4. stāvs",
    //         urlName: "beds4",
    //         component: Beds4Page
    //     },
    //     {
    //         title: "Pirts",
    //         urlName: "sauna",
    //         component: SaunaPage
    //     }
    // ];
    // const [currentSubPageNum, setCurrentSubPageNum] = useState(0);

    // const setSubPage = (num) => {
    //     setCurrentSubPageNum(num);
    // };

    return (
        <div className="page-container">
            {/* <Header 
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
            </main> */}
        </div>
    );
}
