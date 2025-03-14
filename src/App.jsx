import React, { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import CreateExam from "./pages/exams/CreateExam";
import EditExam from "./pages/exams/EditExam";
import ListExams from "./pages/exams/ListExams";
import CreateQuestion from "./pages/questions/CreateQuestion";
import EditQuestion from "./pages/questions/EditQuestion";
import HomeRedirect from "./pages/home/HomeRedirect";
import ForgotPassword from "./pages/login/ForgotPassword";
import OTPPassword from "./pages/login/OTPPassword";
import ResetPassword from "./pages/login/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/account/Profile";
import Search from "./pages/exams/Search";
import InfoExam from "./pages/exams/InfoExam";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          {/* Router Login */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/otp-password" element={<OTPPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* Router Exams */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/workspace/exams/create-exam" element={<CreateExam />} />
            <Route path="/workspace/exams/edit-exam/:examId" element={<EditExam />} />
            <Route path="/workspace/exams/list" element={<ListExams />} />    
            <Route path="/exams/:slug" element={<InfoExam />} />    
          </Route>
          
          {/* Router Questions */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/workspace/exams/create-question/:examId" element={<CreateQuestion />} />
            <Route path="/workspace/exams/edit-question/:examId" element={<EditQuestion />} />
          </Route>

          {/* Router Profile */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/account/profile" element={<Profile />} />
          </Route>

          {/* Router Search */}
          <Route element={<Search/>}>
            <Route path="/exams/search" element={<Search />} />
          </Route>
          
        </Routes>
        <ToastContainer />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
