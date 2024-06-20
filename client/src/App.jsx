import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';

import './App.css'

export default function App() {
	const pages = [
        {
            title: "Kalendārs",
            urlName: "calendar",
            component: CalendarPage
        }
    ];

	return (
		<div className="app">
			<Router>
				<Routes>
					<Route path="/login" element={<LoginPage pages={pages} />} />
					{pages.map((page) => (
						<Route key={page.urlName} path={`/${page.urlName}/*`} element={
							<page.component sidebarPages={pages} parentUrlName={page.urlName}/>
						} />
					))}
					<Route path="*" element={<Navigate to={`/login`} replace />} />
				</Routes>
			</Router>
		</div>
	)
}

