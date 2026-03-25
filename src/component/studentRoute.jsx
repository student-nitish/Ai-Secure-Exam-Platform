import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
  const { token,user,loading } = useSelector((state) => state.auth);
  // console.log("user",user)

  // Wait until profile loads
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Not student
  if (user?.role !== "student") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default StudentRoute;