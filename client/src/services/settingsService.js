// ============================================================
// API INSTANCE
//
// Uses the single shared Axios instance (src/services/api.js)
// instead of creating a second, independently-configured
// instance, so all services stay in sync with VITE_API_URL
// and the auth-token interceptor. Every path below is
// prefixed with "/settings" to match the previous baseURL.
// ============================================================

import settingsApi from "./api";

// ============================================================
// GET SETTINGS
// GET /api/settings
// ============================================================

export const getSettings = async () => {
  const response =
    await settingsApi.get("/settings/");

  return response.data;
};

// ============================================================
// UPDATE PROFILE
// PUT /api/settings/profile
// ============================================================

export const updateProfile =
  async (profileData) => {
    const response =
      await settingsApi.put(
        "/settings/profile",
        profileData
      );

    return response.data;
  };

// ============================================================
// UPLOAD PROFILE PICTURE
// POST /api/settings/profile-picture
// ============================================================

export const uploadProfilePicture =
  async (file) => {
    const formData =
      new FormData();

    formData.append(
      "profilePicture",
      file
    );

    const response =
      await settingsApi.post(
        "/settings/profile-picture",
        formData
      );

    return response.data;
  };

// ============================================================
// GET PROFILE PICTURE
// GET /api/settings/profile-picture
// ============================================================

export const getProfilePicture =
  async () => {
    const response =
      await settingsApi.get(
        "/settings/profile-picture",
        {
          responseType: "blob",
        }
      );

    return response.data;
  };

// ============================================================
// DELETE PROFILE PICTURE
// DELETE /api/settings/profile-picture
// ============================================================

export const deleteProfilePicture =
  async () => {
    const response =
      await settingsApi.delete(
        "/settings/profile-picture"
      );

    return response.data;
  };

// ============================================================
// CHANGE PASSWORD
// PUT /api/settings/password
// ============================================================

export const changePassword =
  async (passwordData) => {
    const response =
      await settingsApi.put(
        "/settings/password",
        passwordData
      );

    return response.data;
  };

// ============================================================
// UPDATE NOTIFICATIONS
// PUT /api/settings/notifications
// ============================================================

export const updateNotifications =
  async (notificationData) => {
    const response =
      await settingsApi.put(
        "/settings/notifications",
        notificationData
      );

    return response.data;
  };

// ============================================================
// UPDATE APPEARANCE
// PUT /api/settings/appearance
// ============================================================

export const updateAppearance =
  async (appearanceData) => {
    const response =
      await settingsApi.put(
        "/settings/appearance",
        appearanceData
      );

    return response.data;
  };

// ============================================================
// UPDATE CRM PREFERENCES
// PUT /api/settings/preferences
// ============================================================

export const updatePreferences =
  async (preferenceData) => {
    const response =
      await settingsApi.put(
        "/settings/preferences",
        preferenceData
      );

    return response.data;
  };

// ============================================================
// DELETE ACCOUNT
// DELETE /api/settings/account
// ============================================================

export const deleteAccount =
  async () => {
    const response =
      await settingsApi.delete(
        "/settings/account"
      );

    return response.data;
  };