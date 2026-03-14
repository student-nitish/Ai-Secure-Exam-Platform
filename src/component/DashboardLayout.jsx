import Sidebar from "../component/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      
      <main  className="ml-0 md:ml-64 mt-16
        bg-[#020617] min-h-screen p-6 w-full">
        <Outlet />
      </main>
    </div>
  );
}
