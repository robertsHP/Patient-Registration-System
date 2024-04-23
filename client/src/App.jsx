import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';

import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';

import './App.css'

export default function App() {
	const pages = [
        {
            title: "Calendar",
            urlName: "calendar",
            component: CalendarPage
        }
    ];

	return (
		<>
			{/* <Sidebar pages={pages} /> */}
			<Router>
				<Routes>
					{pages.map((page) => (
						<Route key={page.urlName} path={`/${page.urlName}*`} element={
							<page.component urlName={page.urlName} />
						} />
					))}
					<Route path="*" element={<Navigate to={`/${pages[0].urlName}`} replace />} />
				</Routes>
			</Router>
		</>
	)
}

