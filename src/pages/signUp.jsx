import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { apiConnector } from "../servicse/apiConnector";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

   const signup = (formData) => {
  return apiConnector(
    "POST",
    "/auth/signup",
    formData
  );
};

  try {
    const response = await signup(form);

    console.log("Signup Response:", response.data);

    toast.success("Signup successful ✅");

    navigate("/login");  // redirect to login page

  } catch (error) {
    console.error("Signup error:", error.response?.data);

    alert(
      error.response?.data?.message ||
      "Signup failed. Try again."
    );
  }
};

  return (
  <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-[#020617] via-[#0f172a] to-black px-4">

    <div className="flex flex-col md:flex-row 
      w-full max-w-[900px] rounded-2xl shadow-lg overflow-hidden">

      {/* LEFT FORM */}
      <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-10">

        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-black">
          Create Account
        </h2>

        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Join ExamSecure AI platform
        </p>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-lg
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-lg
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded-lg
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <span
              className="absolute right-4 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </span>
          </div>

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full p-3 mb-6 rounded-lg
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            className="w-full py-3 rounded-lg text-white
            bg-black hover:bg-gray-800"
          >
            Sign Up
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600 text-sm sm:text-base">
          Already have an account?
          <Link to="/login" className="text-blue-500 ml-1">
            Login
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-black
        items-center justify-center text-white p-6 md:p-8">

        <div className="text-center">
          <img
            src="/images/login-1.png"
            alt="illustration"
            className="w-48 sm:w-64 md:w-80 mx-auto mb-6"
          />

          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            AI Proctored Exams
          </h3>

          <p className="text-gray-400 text-sm md:text-base">
            Secure, intelligent, and reliable
            online examination platform.
          </p>
        </div>

      </div>

    </div>
  </div>
);

}


