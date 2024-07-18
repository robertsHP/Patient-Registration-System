import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';

import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';

import './App.css'

export default function App() {
	const pages = [
		{
            title: "Panelis",
            urlName: "dashboard",
            component: DashboardPage
        }
    ];

	return (
		<>
			<div className="app">
				<Router>
					<Routes>
						<Route path="/login" element={<LoginPage pages={pages} />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/forgot-password" element={<ForgotPasswordPage />} />
						{pages.map((page) => (
							<Route key={page.urlName} path={`/${page.urlName}/*`} element={
								<page.component sidebarPages={pages} parentUrlName={page.urlName}/>
							} />
						))}
						<Route path="*" element={<Navigate to={`/login`} replace />} />
					</Routes>
				</Router>
			</div>
		</>
	)
}

