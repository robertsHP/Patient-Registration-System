import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
// import RegisterPage from './pages/LoginPage/pages/RegisterPage/RegisterPage';
// import ForgotPasswordPage from './pages/LoginPage/pages/ForgotPasswordPage/ForgotPasswordPage';

import UserPage from './pages/UserPage/UserPage.jsx';

import './App.css'

export default function App() {
	const pages = [
		{
            title: "Panelis",
            urlName: "user-page",
            component: UserPage
        }
    ];

	return (
		<>
			<div className="app">
				<Router>
					<Routes>
						<Route path="/login" element={<LoginPage pages={pages} />} />
						{/* <Route path="/register" element={<RegisterPage />} />
						<Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
						{pages.map((page) => (
							<Route key={page.urlName} path={`/${page.urlName}/*`} element={
								<page.component pages={pages} parentUrlName={page.urlName}/>
							} />
						))}
						<Route path="*" element={<Navigate to={`/login`} replace />} />
					</Routes>
				</Router>
			</div>
		</>
	)
}

