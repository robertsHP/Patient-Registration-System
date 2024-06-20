import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import LogoutButton from './LogoutButton.jsx';

import './Header.css'

export default function Header ({sidebarPages, parentUrlName, subPages}) {
    const [currentPage, setCurrentPage] = useState(subPages[0].urlName);

    const handlePageChange = (urlName) => {
        setCurrentPage(urlName);
    }

    return (
        <header>
            <div className="header-left">
                {/* The sidebar component is used here and includes its own toggle button */}
                <Sidebar sidebarPages={sidebarPages} />

                {/* Subpage buttons */}
                {subPages.map(({ urlName, title }) => (
                    <Link key={`${urlName}_link_button`} to={`/${parentUrlName}/${urlName}`}>
                        <button
                            className={`subpage-button ${urlName === currentPage ? 'active-button' : ''}`}
                            onClick={() => handlePageChange(urlName)}
                        >
                            {title}
                        </button>
                    </Link>
                ))}
            </div>
            <div className="header-right">
                <LogoutButton />
            </div>
        </header>

    );
}