import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage/LoginPage.jsx';
// import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';
import ExcelPage from './pages/ExcelPage/ExcelPage.jsx';

import './App.css'

export default function App() {
	const pages = [
        {
            title: "Kalendārs",
            urlName: "calendar",
            component: ExcelPage
        }
    ];

	return (
		<>
			<Router>
				<Routes>
					<Route path="/login" element={<LoginPage pages={pages} />} />
					{pages.map((page) => (
						<Route key={page.urlName} path={`/${page.urlName}/*`} element={
							<page.component pages={pages} page={page}/>
						} />
					))}
					<Route path="*" element={<Navigate to={`/login`} replace />} />
				</Routes>
			</Router>
		</>
	)
}

