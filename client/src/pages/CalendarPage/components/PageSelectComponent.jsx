import React, { useState, useEffect } from 'react';

import { Route, Routes, Link, Navigate } from 'react-router-dom';

import './PageSelectComponent.css'

export default function PageSelectComponent ({pages, component: Component}) {
    return (
        <header>
            {pages.map((page, index) => (
                <Link key={`${page.tableName}_link_button`} to={`/${page.tableName}`}>
                    <button className={`vertical-button`}>
                        {page.title}
                    </button>
                </Link>
            ))}
            <Routes>
                {pages.map((page, index) => (
                    <Route key={page.tableName} path={`/${page.tableName}/*`} element={
                        <Component
                            tableName={page.tableName}
                        />
                    } />
                ))}
                <Route path="*" element={<Navigate to={`/${pages[0].tableName}`} />} />
            </Routes>
        </header>
    );
}

// ${id === index ? 'selected' : ''}