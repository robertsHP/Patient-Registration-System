import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CalendarPage from './pages/CalendarPage';

import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
