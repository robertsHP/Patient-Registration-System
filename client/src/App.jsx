import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';

import './App.css'

export default function App() {
	const pages = [
		// {
        //     title: "Pieslēgties",
        //     urlName: "",
        //     component: LoginPage
        // },
        {
            title: "Kalendārs",
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
						<Route key={page.urlName} path={`/${page.urlName}/*`} element={
							<page.component pages={pages} page={page}/>
						} />
					))}
					<Route path="*" element={<Navigate to={`/${pages[0].urlName}`} replace />} />
				</Routes>
			</Router>
		</>
	)
}

