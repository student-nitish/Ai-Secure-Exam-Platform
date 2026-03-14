import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationRead,
} from "../servicse/notification";
import socket from "../socket";
import { useNavigate } from "react-router-dom";

import { FileText, BarChart3, Bell } from "lucide-react";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();

    socket.on("newExam", addNotification);
    socket.on("resultPublished", addNotification);

    return () => {
      socket.off("newExam");
      socket.off("resultPublished");
    };
  }, []);

  const handleBellClick = () => {
    setOpen(!open);

    if (!open) {
      setTimeout(() => {
        notifications.forEach((n) => {
          if (!n.isRead && n._id) {
            markNotificationRead(n._id);
          }
        });

        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }, 3000); // 5 seconds delay
    }
  };

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    setNotifications(data);
  };

  const addNotification = (data) => {
    setNotifications((prev) => [
      {
        message: data.message,
        type: data.type,
        isRead: false,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type) => {
    if (type === "EXAM_CREATED")
      return <FileText size={16} className="text-blue-400" />;

    if (type === "RESULT_PUBLISHED")
      return <BarChart3 size={16} className="text-green-400" />;

    return <Bell size={16} className="text-gray-400" />;
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button onClick={handleBellClick} className="relative p-2 rounded-lg ">
        <Bell size={22} className="text-white hover:text-blue-400" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute md:left-1/6 md:-translate-x-1/2 top-full mt-2 md:w-92 w-72 sm:w-80 
  bg-[#0f172a] border border-gray-700 rounded-xl right-0
   shadow-[0_10px_40px_rgba(0,0,0,0.6)]
    z-50"
        >
          {/* Arrow */}
          <div
            className="absolute -top-1.5 md:left-1/2 right-5 md:right-0 -translate-x-1/2 
    w-3 h-3 bg-[#0f172a] border-l border-t border-gray-700 rotate-45"
          ></div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="text-xl  font-semibold text-blue-300">
              Notifications
            </h3>

            {notifications.length > 0 && (
              <span className="text-xs text-gray-400">
                {notifications.length}
              </span>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm p-4">No notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={n._id || i}
                  className={`flex gap-3 px-4 py-3 text-sm cursor-pointer
              hover:bg-white/5 transition
              ${!n.isRead ? "text-white" : "text-gray-400"}`}
                >
                  {/* Icon */}
                  <div className="mt-1">{getIcon(n.type)}</div>

                  {/* Text */}
                  <div className="flex flex-col flex-1">
                    <div className="flex gap-2 items-center">
                      <span className="leading-snug">{n.message}</span>

                      <span
                        onClick={() => {
                          n.type === "EXAM_CREATED"
                            ? navigate("/allexams")
                            : navigate("/student/allexams");
                        }}
                        className="text-blue-400 cursor-pointer hover:underline text-sm"
                      >
                        See
                      </span>
                    </div>

                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
