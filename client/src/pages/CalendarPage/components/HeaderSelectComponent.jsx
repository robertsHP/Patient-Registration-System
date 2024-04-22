import React, { useState, useEffect } from 'react';

import { Route, Routes, Link, Navigate } from 'react-router-dom';

// import '../../../global.css'
import './HeaderSelectComponent.css'

export default function HeaderSelectComponent({pages}) {
    const [path, setPath] = useState(`/${pages[0].urlName}`);

    useEffect(() => {
    }, [pages]);

    return (
        <>
            {pages.map(({urlName, title}) => (
                <Link key={`${urlName}_link_button`} to={`/${urlName}`}>
                    <button className="vertical-button">{title}</button>
                </Link>
            ))}
            <Routes>
                {pages.map(({urlName, component: Component}) => (
                    <Route key={`${urlName}_route`} path={`/${urlName}/*`} element={
                        <Component />
                    } />
                ))}
                <Route path="*" element={<Navigate to={path} replace />} />
            </Routes>
        </>
    );
}


