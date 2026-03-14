import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Login from "./pages/login";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signUp";
import Home from "./pages/home";
import { Toaster } from "sonner";
import { PrivateRoute } from "./component/privateRoute";
import { PublicRoute } from "./component/publicRoute";
import DashboardNavbar from "./component/navbar";
import AdminDashboard from "./pages/adminDashboard";
import AdminRoute from "./component/adminRoute";
import DashboardLayout from "./component/DashboardLayout";
import CreateExam from "./pages/admin/createExam";
import AddQuestions from "./pages/admin/addQuestion";
import AdminExams from "./pages/admin/adminExams";
import EditExam from "./pages/admin/editExam";
import AllExams from "./pages/allExams";
import StudentExam from "./pages/startExam";
import StudentRoute from "./component/studentRoute";
import ExamSubmitted from "./pages/ExamSubmitted";
import StudentDashboard from "./pages/student/studentDashboard";
import ResultAnalysis from "./pages/student/ResultAnalysis";
import StudentExams from "./pages/student/studentExams";
import EvaluateExam from "./pages/admin/evaluateExams";
import PendingEvaluations from "./pages/admin/allPendingExams";
import { useLocation } from "react-router-dom";
import socket from "./socket";
import Leaderboard from "./pages/leaderBoard";
import ProfileSettings from "./pages/profileSetting";
import { toast } from "sonner";


function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

 const hideNavbar = location.pathname.startsWith("/student/exam/");

 useEffect(() => {
  if (user && user.role === "student") {
    socket.connect();                // connect socket after login
    socket.emit("registerUser", user._id); // join socket room


    socket.on("newExam", (data) => {
    toast.success(data.message);
  });

  socket.on("resultPublished", (data) => {
    toast.success(data.message);
  });

  }

   else {
    socket.disconnect();
  }
  
  

  return () => {
    socket.off("newExam");
    socket.off("resultPublished");
  };

}, [user]);

  return (
    <div className="">
      <Toaster position="bottom-right" richColors />

      {!hideNavbar && <DashboardNavbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/setting"
            element={
              <PrivateRoute>
                <ProfileSettings />
              </PrivateRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/allexams"  element={
              <StudentRoute>
                <AllExams/>
              </StudentRoute>
            } />

          {/* ALL admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute user={user}>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="create-exam" element={<CreateExam />} />
            <Route path="exam/:examId/questions" element={<AddQuestions />} />
            <Route path="all/exams" element={<AdminExams />} />
            <Route path="edit-exam/:examId" element={<EditExam />} />
            <Route path="evaluate" element={<PendingEvaluations />} />
             <Route path="evaluate/:attemptId" element={<EvaluateExam />} />
          </Route>
          
          {/* All student route */}
          <Route
            path="/student"
            element={
              <StudentRoute user={user}>
                <DashboardLayout />
              </StudentRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="allexams" element={<StudentExams/>} />
            <Route path="results/:attemptId" element={<ResultAnalysis/>} />
            <Route path="leaderboard" element={<Leaderboard/>} />
          </Route>

          <Route
            path="/student/exam/:examId"
            element={
              <StudentRoute>
                <StudentExam />
              </StudentRoute>
            }
          />

          <Route
            path="/exam-submitted/:attemptId"
            element={
              <StudentRoute>
                <ExamSubmitted />
              </StudentRoute>
            }
          />

          
        </Routes>
        
      </main>
    </div>
  );
}

export default App;
