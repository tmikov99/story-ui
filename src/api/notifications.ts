import { NotificationData } from "../types/notification";
import axios from "./axios";

export const fetchNotifications = async ():Promise<NotificationData[]> => {
  const response = await axios.get("/notifications");
  return response.data;
};

export const markAsRead = async (notificationIds: number[]) => {
  await axios.put("/notifications/read", notificationIds);
}