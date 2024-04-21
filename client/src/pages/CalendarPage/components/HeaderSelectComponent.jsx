import React, { useState, useEffect } from 'react';

import { Route, Routes, Link, Navigate } from 'react-router-dom';

// import '../../../global.css'
import './HeaderSelectComponent.css'

export default function PageSelectComponent ({pageData, component: Component}) {
    const [path, setPath] = useState(null);

    useEffect(() => {
        setPath(`/${pageData[0].urlName}`);
    }, [pageData]);

    return (
        <>
            {pageData.map((d) => (
                <Link key={`${d.urlName}_link_button`} to={`/${d.urlName}`}>
                    <button className="vertical-button">{d.title}</button>
                </Link>
            ))}
            <Routes>
                {pageData.map((d) => (
                    <Route key={d.urlName} path={`/${d.urlName}/*`} element={
                        <Component pageData={d} />
                    } />
                ))}
                <Route path="*" element={<Navigate to={path} replace />} />
            </Routes>
        </>
    );
}
