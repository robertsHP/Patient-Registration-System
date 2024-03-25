import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import CalendarPage from './pages/CalendarPage';

import './App.css'

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then(response => console.log(response.json()))
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  console.log(data);

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
