import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import CreateExam from "./pages/exams/CreateExam";
import EditExam from "./pages/exams/EditExam";
import ListExams from "./pages/exams/ListExams";
import CreateQuestion from "./pages/questions/CreateQuestion";
import EditQuestion from "./pages/questions/EditQuestion";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/workspace/exams/create-exam" element={<CreateExam />} />
          <Route path="/workspace/exams/edit-exam/:examId" element={<EditExam />} />
          <Route path="/workspace/exams/list" element={<ListExams />} />
          <Route path="/workspace/exams/create-question/:examId" element={<CreateQuestion />} />
          <Route path="/workspace/exams/edit-question/:examId" element={<EditQuestion />} />
        </Routes>
        <ToastContainer />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
