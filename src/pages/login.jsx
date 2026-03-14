import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate} from "react-router-dom";
import { apiConnector } from "../servicse/apiConnector";

import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { toast } from "sonner";
import socket from "../socket";


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const response = await apiConnector("POST", "/auth/login", form);

    const { success, token, user, message } = response.data;
   
  if (success) {
  
    dispatch(setCredentials({ user, token }));
    
       if (!socket.connected) {
      socket.connect();
    }

    socket.emit("registerUser", user._id);

   toast.success(
  user?.role === "admin"
    ? "Welcome back Admin 🎉"
    : `Welcome back ${user?.name} 🎉`
);
    navigate("/");

  } else {
    toast.error(message || "Login failed");
  }

   } catch (error) {
    toast.error(
    error.response?.data?.message || "Something went wrong"
  );
  console.error("Login error:", error.response?.data);
  
}
  };

  return (
  <div className="min-h-screen flex items-center justify-center 
  bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#01283e] px-4">

    <div className="flex flex-col md:flex-row 
    w-full max-w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden">

      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10">

        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Welcome Back!
        </h2>

        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Please enter login details below
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 cursor-pointer"
            >
              👁️
            </span>
          </div>

          {/* Forgot password */}
          <div className="text-right mb-4">
            <a href="#" className="text-sm text-gray-500">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 
            rounded-lg hover:bg-gray-800"
          >
            Sign In
          </button>

        </form>

        {/* Signup link */}
        <p className="text-center mt-6 text-sm">
          Don’t have an account?
          <Link
            to="/signup"
            className="text-blue-500 font-semibold ml-1"
          >
            Signup
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden md:flex md:w-1/2 bg-black 
      items-center justify-center text-white p-6">

        <div className="text-center">
          <img
            src="/images/login-1.png"
            alt="illustration"
            className="w-48 sm:w-64 md:w-80 mx-auto mb-6"
          />

          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            AI Exam Platform
          </h3>

          <p className="text-gray-400 text-sm md:text-base">
            Secure online exams with AI proctoring.
          </p>
        </div>
      </div>

    </div>
  </div>
);

}
