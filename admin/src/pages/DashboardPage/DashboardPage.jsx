import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';
import MainView from './components/MainView.jsx';

import './DashboardPage.css';

export default function DashboardPage() {
    const subPages = [
        {
            title: "Users",
            urlName: "users",
            component: BedsPage
        }
    ];

    return (
        <div className="dashboard-container">
            <Header sidebarPages={sidebarPages} parentUrlName={parentUrlName} subPages={subPages}/>
            <main>
                <Sidebar />
                <MainView />
                <Routes>
                    {subPages.map(({urlName, component: Component}) => (
                        <Route 
                            key={`${urlName}_route`} 
                            path={`/${urlName}/*`} 
                            element={<Component />} 
                        />
                    ))}
                    <Route path="*" element={<Navigate to={`${subPages[0].urlName}`} replace />} />
                </Routes>
            </main>
        </div>
    );
}