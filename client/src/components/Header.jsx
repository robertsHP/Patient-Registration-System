import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import LogoutButton from './LogoutButton.jsx';

import './Header.css'

export default function Header ({sidebarPages, parentUrlName, subPages, currentSubPageNum, setCurrentSubPageNum}) {
    const handlePageChange = (num) => {
        setCurrentSubPageNum(num);
    };

    return (
        <header>
            <div className="left">
                {/* The sidebar component is used here and includes its own toggle button */}
                <Sidebar sidebarPages={sidebarPages} />

                {/* Subpage buttons */}
                {Object.entries(subPages).map(([key, page]) => (
                    <Link key={key} to={`/${parentUrlName}/${page.urlName}`}>
                        <button
                            className={`subpage-button ${key === currentSubPageNum ? 'active-button' : ''}`}
                            onClick={() => handlePageChange(key)}
                        >
                            {page.title}
                        </button>
                    </Link>
                ))}
            </div>
            <div className="right">
                <LogoutButton />
            </div>
        </header>
    );
}