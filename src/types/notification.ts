export interface NotificationData {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
  type: "ACHIEVED_VIEWS" | "NEW_COMMENT";
  targetId: number;
}