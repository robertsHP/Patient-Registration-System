import React, { useState } from 'react';

import HeaderSelectComponent from './components/HeaderSelectComponent.jsx';

import BedsPage from './pages/BedsData.jsx';

import './CalendarPage.css'

export default function CalendarPage () {
    var pages = [
        {
            title: "Gultas",
            urlName: "beds",
            component: BedsPage
        }
    ];

    return (
        <>
            <HeaderSelectComponent pages={pages}/>
        </>
    );
}



// const [value, setValue] = useState('');

// const handleChange = (event) => {
//     setValue(event.target.value);
// };

// const TagComponent = bedsData.title.tag;

// return (
//     <>
//         <TagComponent value={value} onChange={handleChange} />
//     </>
// );