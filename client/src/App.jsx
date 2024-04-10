import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import AdminPanel from './pages/AdminPanel/AdminPanel.jsx';
import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';

import './App.css'

// require('dotenv').config({ path: '../.env' });

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<CalendarPage />} />
          {/* <Route path="/admin/*" element={<AdminPanel />} /> */}
        </Routes>
      </Router>
    </>
  )

  // console.log(import.meta.env.VITE_SERVER_ORIGIN);

  // var column = 'username';
  // var value = 'user2';

  // GET
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/users?column=${column}&value=${value}`)
  //   .then(response => {
  //       if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //   })
  //   .then(data => console.log(data))
  //   .catch(error => {
  //     console.error('There has been a problem with your fetch operation:', error);
  //   });
  // }, []);


  // ////POST
  // let test = { key1: 'value1', key2: 'value2' }; // replace with your data

  // fetch(`${import.meta.env.VITE_SERVER_ORIGIN}/data`, {
  //   method: 'POST', 
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(test),
  // })
  // .then(response => response.json())
  // .then(test => console.log(test))
  // .catch((error) => {
  //   console.error('Error:', error);
  // });

}
