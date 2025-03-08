import React from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateExam from './pages/CreateExam';
import Dashboard from './pages/Dashboard';
import CreateQuestion from './pages/CreateQuestion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/de-thi/tao-de-thi" element={<CreateExam />} />
        <Route path="/de-thi/tao-cau-hoi/:examId" element={<CreateQuestion />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
