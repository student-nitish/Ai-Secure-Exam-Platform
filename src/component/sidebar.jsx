import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ⭐ Role-based menu
  const studentLinks = [
    { name: "Dashboard", path: "/student",end:true },
    { name: "Results", path: "/student/allexams" },
    {name: "Leaderboard", path: "/student/leaderboard"},   
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin",end : true },
    { name: "Create Exam", path: "/admin/create-exam" },
    { name: "All Exams", path: "/admin/all/exams" },
    { name: "Evaluate Exams", path: "/admin/evaluate" },
  ];

  const links =
    user?.role === "admin" ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-20 left-3 z-50
        text-white bg-[#0F172A] p-2 rounded"
      >
        ☰
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0
          h-[calc(100vh-4rem)]
          w-64 bg-[#0F172A]
          border-r border-gray-700
          text-white z-50
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
       

        {/* Links */}
        <nav className="flex flex-col p-4 gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:bg-yellow-500/20
                ${
                  isActive
                    ? "bg-yellow-500/30 text-yellow-400"
                    : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        
       
      </aside>
    </>
  );
}
