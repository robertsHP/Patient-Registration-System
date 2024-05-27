import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';
import MainView from './components/MainView.jsx';

import './DashboardPage.css';

export default function DashboardPage() {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <MainView />
        </div>
    );
}