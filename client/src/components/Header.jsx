import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import LogoutButton from './LogoutButton.jsx';

import routes from '../routes/routes.jsx';
import useNavigation from '../hooks/useNavigation.jsx';

import './Header.css'

export default function Header ({mainPageUrl, subPages}) {
    const { currentPath, navigateTo } = useNavigation();

    const handlePageChange = (url) => {
        navigateTo(url);
    };

    return (
        <div className="header">
            <div className="header__left">
                {/* The sidebar component is used here and includes its own toggle button */}
                <Sidebar sidebarPages={routes.system.pages} />

                {/* Subpage buttons */}
                {Object.entries(subPages).map(([key, page]) => (
                    <Link 
                        key={key} 
                        to={mainPageUrl+page.url+page.getDefaultURLValues()}
                    >
                        <button
                            className={
                                `header__subpage-button ${
                                    currentPath.includes(mainPageUrl+page.url) ?
                                        'header__active-button' 
                                        : 
                                        ''
                                }`
                            }
                            onClick={() => handlePageChange(
                                mainPageUrl+page.url+page.getDefaultURLValues()
                            )}
                        >
                            {page.title}
                        </button>
                    </Link>
                ))}
            </div>
            <div className="header__right">
                <LogoutButton />
            </div>
        </div>
    );
}

