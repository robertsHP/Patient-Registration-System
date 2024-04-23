import React, { useState } from 'react';
import { Router, Route, Routes, Link } from 'react-router-dom';

import './Sidebar.css'

export default function Sidebar ({pages}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <button className="toggle-sidebar-button" onClick={toggleSidebar}>
                Toggle Sidebar
            </button>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {pages.map((page) => (
                    <Link key={page.urlName} to={`/${page.urlName}`}>
                        {page.title}
                    </Link>
                ))}
            </div>
        </>
    );
}