import { apiConnector } from "./apiConnector";

export const fetchNotifications = async () => {
  const res = await apiConnector("GET", "/notification/all");
  return res.data.notifications;
};

export const markNotificationRead = async (id) => {
  await apiConnector("PATCH", `/notification/${id}`);
};