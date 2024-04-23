import React, { useState, useEffect } from 'react';

import { Route, Routes, Link, Navigate } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';

// import '../../../global.css'
import './HeaderSelectComponent.css'

export default function HeaderSelectComponent({subPages, urlName}) {
    const [path, setPath] = useState(`/${subPages[0].urlName}`);

    useEffect(() => {
    }, [subPages]);

    console.log("/"+urlName+"/"+path);

    return (
        <>
            <div >
                {subPages.map(({urlName, title}) => (
                    <Link key={`${urlName}_link_button`} to={`/${urlName}`}>
                        <button className="vertical-button">{title}</button>
                    </Link>
                ))}
                <Routes>
                    {subPages.map(({urlName, component: Component}) => (
                        <Route key={`${urlName}_route`} path={`/${urlName}/*`} element={
                            <Component />
                        } />
                    ))}
                </Routes>
            </div>
        </>
    );
}


