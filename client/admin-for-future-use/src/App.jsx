import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';

import './App.css'

export default function App() {
	const pages = [
        {
            title: "Pieslēgties",
            urlName: "login",
            component: LoginPage
        },
		{
            title: "Panelis",
            urlName: "dashboard",
            component: DashboardPage
        }
    ];

	return (
		<>
			<Router>
				<Routes>
					{pages.map((page) => (
						<Route key={page.urlName} path={`/admin/${page.urlName}/*`} element={
							<page.component page={page}/>
						} />
					))}
					<Route path="*" element={<Navigate to={`/admin/${pages[0].urlName}`} replace />} />
				</Routes>
			</Router>
		</>
	)
}

