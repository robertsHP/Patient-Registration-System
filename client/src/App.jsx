import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import CalendarPage from './pages/CalendarPage';

import './App.css'

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => console.log(data))
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
        </Routes>
      </Router>
      
      <div>
        {data && <div>{JSON.stringify(data)}</div>}
      </div>
    </>
  )
}

export default App
