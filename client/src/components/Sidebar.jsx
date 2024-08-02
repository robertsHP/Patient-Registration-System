import React, { useState } from 'react';
import { Router, Route, Routes, Link } from 'react-router-dom';

import './Sidebar.css'

export default function Sidebar ({sidebarPages}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarOnClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {Object.entries(sidebarPages).map(([key, page]) => (
                    <div className="sidebar-link" key={key}>
                        <Link to={`/${page.urlName}`}>
                            {page.title}
                        </Link>
                    </div>
                ))}
            </aside>
            <button className="sidebar-button" onClick={sidebarOnClick}>
                ...
            </button>
        </>
    );
}