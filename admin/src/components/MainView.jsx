import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// import Page1 from '../Pages/Page1';
// import Page2 from '../Pages/Page2';
// import Page3 from '../Pages/Page3';

import './MainView.css';


function TestPage () {
    return (
        <>aaa</>
    );
}

export default function MainView() {

    
    return (
        <div className="mainview">
            <Routes>
                <Route path="/page1" component={TestPage} />
                <Route path="/page2" component={TestPage} />
                <Route path="/page3" component={TestPage} />
            </Routes>
        </div>
    );
}