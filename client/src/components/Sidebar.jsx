import React, { useState } from 'react';
import { Router, Route, Routes, Link } from 'react-router-dom';

import './Sidebar.css'

export default function Sidebar ({pages}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarOnClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {pages.map((page) => (
                    <div className="sidebar-link" key={page.urlName}>
                        <Link to={`/${page.urlName}`}>
                            {page.title}
                        </Link>
                    </div>
                ))}
            </div>
            <button className="sidebar-button" onClick={sidebarOnClick}>
                ...
            </button>
        </>
    );
}