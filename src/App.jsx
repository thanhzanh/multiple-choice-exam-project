import React from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateExam from './pages/CreateExam';
import Dashboard from './pages/Dashboard';
import CreateQuestion from './pages/CreateQuestion';
import ListExams from './pages/ListExams';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace/exams/create-exam" element={<CreateExam />} />
        <Route path="/workspace/exams/list" element={<ListExams />} />
        <Route path="/workspace/exams/create-question/:examId" element={<CreateQuestion />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
