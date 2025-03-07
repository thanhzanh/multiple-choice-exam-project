import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateExam from './pages/CreateExam';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/de-thi/tao-de-thi" element={<CreateExam />} />
      </Routes>
    </Router>
  )
}

export default App
