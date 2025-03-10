import React from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';
import Dashboard from './pages/Dashboard';
import CreateQuestion from './pages/CreateQuestion';
import ListExams from './pages/ListExams';
import EditQuestion from './pages/EditQuestion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace/exams/create-exam" element={<CreateExam />} />
        <Route path="/workspace/exams/edit-exam/:examId" element={<EditExam />} />
        <Route path="/workspace/exams/list" element={<ListExams />} />
        <Route path="/workspace/exams/create-question/:examId" element={<CreateQuestion />} />
        <Route path="/workspace/exams/edit-question/:examId" element={<EditQuestion />} />
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
