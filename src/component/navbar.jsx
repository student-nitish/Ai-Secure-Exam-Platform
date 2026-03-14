import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sun, Moon, Menu, X, User, Bell } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { apiConnector } from "../servicse/apiConnector";
import NotificationBell from "./notification";

import { logout } from "../redux/authSlice";
import { toast } from "sonner";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import socket from "../socket";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const role = user?.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiConnector("POST", "/auth/logout", {}, { withCredentials: true });

      dispatch(logout());
      socket.disconnect();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <nav
      className={`fixed z-50 h-16   left-0 right-0 transition-all duration-300
  ${
    scrolled
      ? "top-0 mx-6 rounded-2xl shadow-lg dark:bg-[#0F172A]/90 bg-[#0F172A]/80 backdrop-blur-lg border border-white/10"
      : "top-0 bg-[#0F172A]/80 dark:bg-[#0F172A]/90 border-b border-white/10"
  }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex md:-ml-20  items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-r
        from-blue-500 to-cyan-400 flex items-center
        justify-center text-white"
          >
            🔒
          </div>
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer md:font-semibold md:text-2xl bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent "
          >
            ExamSecure AI
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden font-semibold md:flex items-center gap-8">
          {role !== "admin" &&
            [" Explore Exams"].map((item) => (
              <Link
                key={item}
                to="/allexams"
                className="text-gray-300 hover:text-cyan-400 transition"
              >
                {item}
              </Link>
            ))}

          {/* Notification Icon */}
          {isLoggedIn && role !== "admin" && (
            <div className="relative p-2 rounded-lg">
              <NotificationBell />
            </div>
          )}

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <User size={20} className="text-gray-300" />
              </button>

              {profileOpen && (
                <div
                  onClick={() => setProfileOpen(false)}
                  className="fixed inset-0 bg-[#0F172A]/2 z-40"
                />
              )}

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 z-50 rounded-xl bg-slate-900 border border-slate-700 shadow-xl p-2 ">
                  {/* Profile Header */}
                  <div className="flex items-center gap-3 px-3 py-2">
                    <img
                      src={user?.image}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border border-slate-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {user?.role || "student"}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-700 my-2"></div>

                  {/* Dashboard */}
                  <button
                    onClick={() => {
                      user?.role === "admin"
                        ? navigate("/admin")
                        : navigate("/student");
                    }}
                    className="flex gap-2 items-center w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </button>

                  {/* Settings */}
                  <button 
                  onClick={()=>navigate("/setting")}
                        className="flex gap-2 w-full items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition">
                    <Settings size={16} />
                    Settings
                  </button>

                  {/* Logout */}
                  <button
                    onClick={() => handleLogout()}
                    className="w-full flex gap-2 items-center px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-300 hover:text-white"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 rounded-lg
              bg-gradient-to-r from-cyan-500 to-emerald-400
              text-white font-medium"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          {isLoggedIn && role !== "admin" && <NotificationBell />}

          <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pt-3 pb-6 space-y-4
      bg-[#020617] text-gray-300"
        >
          {role !== "admin" &&
            [" Explore Exams"].map((item) => (
              <Link
                key={item}
                to="/allexams"
                className="text-gray-300 block pl-6 pt-2"
              >
                {item}
              </Link>
            ))}

          {isLoggedIn ? (
            <div className="flex pl-4 flex-col gap-2">
              <button
                onClick={() => {
                  user?.role === "admin"
                    ? navigate("/admin")
                    : navigate("/student");
                }}
                className=" text-left px-4 py-2 hover:bg-white/10"
              >
                Dashboard
              </button>

              <button className=" text-left px-4 py-2 hover:bg-white/10">
                Settings
              </button>

              <button
                onClick={() => handleLogout()}
                className="w-full text-left px-4 py-2 text-red-400
                  hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className=" flex gap-4">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-300 font-semibold hover:text-white"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 rounded-lg
              bg-gradient-to-r from-cyan-500 to-emerald-400
              text-white font-medium"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
