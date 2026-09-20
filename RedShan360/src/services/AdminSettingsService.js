import api from "./api";

const STORAGE_KEYS = {
  PROFILE: "redshan360_admin_profile",
  NOTIFICATIONS: "redshan360_admin_notifications",
};

// Default profile values matching Eleanor Thorne in mockup
const DEFAULT_PROFILE = {
  fullName: "Eleanor Thorne",
  email: "eleanor.thorne@redshan360.com",
  phone: "+1 (555) 234-5678",
  role: "Super Admin",
  profilePicture: null, // null means use default-profile.png fallback
};

// Default notifications
const DEFAULT_NOTIFICATIONS = {
  emailNotifications: true,
  newOrderAlerts: true,
  lowStockAlerts: true,
  monthlyReportEmails: false,
  lowStockThreshold: 5,
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const AdminSettingsService = {
  /**
   * Retrieves profile details from backend database API.
   */
  getProfile: async () => {
    const response = await api.get("/api/admin/settings");
    return response.data;
  },

  /**
   * Updates profile text fields in backend database API.
   */
  updateProfile: async (profileData) => {
    const payload = {
      name: profileData.name || profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
    };
    const response = await api.put("/api/admin/settings", payload);
    const updated = response.data;
    window.dispatchEvent(new CustomEvent("adminProfileUpdated", { detail: updated }));
    return updated;
  },

  /**
   * Uploads a new profile picture (simulated by storing base64 Data URL).
   */
  uploadProfilePicture: async (base64DataUrl) => {
    await delay(600);
    const current = await AdminSettingsService.getProfile();
    current.profilePicture = base64DataUrl;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(current));

    window.dispatchEvent(new CustomEvent("adminProfileUpdated", { detail: current }));
    return { success: true, message: "Profile picture uploaded successfully.", profilePicture: base64DataUrl };
  },

  /**
   * Deletes profile picture (restores default-profile).
   */
  deleteProfilePicture: async () => {
    await delay(300);
    const current = await AdminSettingsService.getProfile();
    current.profilePicture = null;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(current));

    window.dispatchEvent(new CustomEvent("adminProfileUpdated", { detail: current }));
    return { success: true, message: "Profile picture deleted." };
  },

  /**
   * Updates administrator password in backend database API.
   */
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const payload = {
      currentPassword,
      newPassword,
      confirmPassword: confirmPassword || newPassword,
    };
    const response = await api.put("/api/admin/settings?action=password", payload);
    return response.data;
  },

  /**
   * Retrieves notification settings from backend database.
   */
  getNotifications: async () => {
    try {
      const response = await api.get("/api/admin/settings/notifications");
      if (response.data) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(response.data));
        return response.data;
      }
    } catch (err) {
      console.warn("Backend notification fetch failed, falling back to local storage:", err);
    }
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : { ...DEFAULT_NOTIFICATIONS };
  },

  /**
   * Updates notification settings in backend database.
   */
  updateNotifications: async (notificationPrefs) => {
    try {
      const response = await api.put("/api/admin/settings/notifications", notificationPrefs);
      if (response.data && response.data.success) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(response.data.data || notificationPrefs));
        return response.data;
      }
    } catch (err) {
      console.warn("Backend notification update failed, falling back to local storage:", err);
    }
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationPrefs));
    return { success: true, message: "Notification preferences saved." };
  }
};

