import api from "./api";


// ============================================================
// GET ALL NOTIFICATIONS
// ============================================================

export const getNotifications = async () => {
  const response = await api.get("/notifications");

  return response.data;
};


// ============================================================
// GET UNREAD NOTIFICATION COUNT
// ============================================================

export const getUnreadNotificationCount = async () => {
  const response = await api.get(
    "/notifications/unread-count"
  );

  return response.data;
};


// ============================================================
// MARK ONE NOTIFICATION AS READ
// ============================================================

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(
    `/notifications/${id}/read`
  );

  return response.data;
};


// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch(
    "/notifications/read-all"
  );

  return response.data;
};


// ============================================================
// DELETE NOTIFICATION
// ============================================================

export const deleteNotification = async (id) => {
  const response = await api.delete(
    `/notifications/${id}`
  );

  return response.data;
};