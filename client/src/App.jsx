import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import CalendarPage from './pages/CalendarPage';

import './App.css'

// require('dotenv').config({ path: '../.env' });

function App() {
  // console.log(import.meta.env.VITE_SERVER_ORIGIN);

  var column = 'username';
  var value = 'user2';

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

  return (
    <>
      <Router>
        <Routes>
          <Route path="/gultas" element={
            <CalendarPage tableName="gultas" title="Gultas" />
          } />
          <Route path="/gultas4" element={
            <CalendarPage tableName="gultas4" title="Gultas4" />
          } />
          <Route path="/pirts" element={
            <CalendarPage tableName="pirts" title= "Pirts" />
          } />
          <Route path="/" element={<Navigate to="/gultas" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
