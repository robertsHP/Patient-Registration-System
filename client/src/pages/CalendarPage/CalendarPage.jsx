import React, { useEffect, useState } from 'react';
import { useNavigate, Route, Routes, Link, Navigate } from 'react-router-dom';

import Header from '../../components/Header.jsx';

import routes from '../../routes/routes.jsx';

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
    const [currentSubPageNum, setCurrentSubPageNum] = useState(0);

    const setSubPage = (num) => {
        setCurrentSubPageNum(num);
    };

    useEffect(() => {
        console.log('WORK');
    });

    var calendar = routes.system.pages.calendar;

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
                    {Object.entries(calendar.subPages).map(([key, page]) => (
                        <Route 
                            key={`${key}_route`} 
                            path={calendar.url + page.url} 
                            element={page.component} 
                        />
                    ))}
                </Routes>
            </main>
        </div>
    );
}
