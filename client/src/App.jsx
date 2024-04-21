import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';

import './App.css'

export default function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/*" element={<CalendarPage />} />
				</Routes>
			</Router>
		</>
	)
}
