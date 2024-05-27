import React from 'react';
import { NavLink } from 'react-router-dom';

import './Sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h1 className="title">Admin Dashboard</h1>
            <ul className="menu">
                <li className="menuItem"><NavLink to="/page1">Page 1</NavLink></li>
                <li className="menuItem"><NavLink to="/page2">Page 2</NavLink></li>
                <li className="menuItem"><NavLink to="/page3">Page 3</NavLink></li>
                {/* Additional links can be added here */}
            </ul>
        </div>
    );
}