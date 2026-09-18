import "./AdminTopbar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfileAvatar from "../../assets/default-profile.png";
import elenaThorneAvatar from "../../assets/elena_thorne.png";
import api from "../../services/api";

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function getNotificationIcon(type) {
  switch (type) {
    case "NEW_ORDER":
      return (
        <span className="notif-type-icon new-order">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </span>
      );
    case "LOW_STOCK":
      return (
        <span className="notif-type-icon low-stock">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </span>
      );
    case "REPORT_DOWNLOADED":
      return (
        <span className="notif-type-icon report">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </span>
      );
    case "EMAIL_COMMUNICATION":
      return (
        <span className="notif-type-icon email">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </span>
      );
    default:
      return (
        <span className="notif-type-icon system">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </span>
      );
  }
}

function AdminTopbar({ searchPlaceholder = "Search premium catalog...", searchValue, onSearchChange }) {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-updated"));
    navigate("/login");
  };

  const [profile, setProfile] = useState({
    fullName: "Elena Thorne",
    role: "Curator & Admin",
    profilePicture: elenaThorneAvatar,
  });

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/api/admin/notifications/unread-count");
      if (res.data && res.data.count !== undefined) {
        setUnreadCount(res.data.count);
      }
    } catch (err) {
      console.warn("Failed to fetch unread count:", err);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await api.get("/api/admin/notifications");
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);

    const loadProfile = () => {
      const stored = localStorage.getItem("redshan360_admin_profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile({
            fullName: parsed.fullName || "Elena Thorne",
            role: parsed.role || "Curator & Admin",
            profilePicture: parsed.profilePicture || elenaThorneAvatar,
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadProfile();

    const handleProfileUpdate = (e) => {
      const updated = e.detail;
      setProfile({
        fullName: updated.fullName,
        role: updated.role,
        profilePicture: updated.profilePicture || elenaThorneAvatar,
      });
    };

    window.addEventListener("adminProfileUpdated", handleProfileUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener("adminProfileUpdated", handleProfileUpdate);
    };
  }, []);

  const handleOpenNotifications = (e) => {
    e.preventDefault();
    setShowNotifications(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/api/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/api/admin/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return (
    <div className="admin-topbar">
      {/* Search Bar */}
      <div className="topbar-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue !== undefined ? searchValue : ""}
          onChange={onSearchChange}
        />
      </div>

      {/* Right Side Actions */}
      <div className="topbar-actions">
        {/* Notifications (Bell) */}
        <button
          type="button"
          className="icon-btn notif-bell-btn"
          onClick={handleOpenNotifications}
          title="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <span className="badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
          )}
        </button>

        {/* Mail Icon */}
        <a href="/messages" className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </a>

        {/* Settings (Cog) Icon */}
        <a href="/adminSettings" className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </a>

        {/* Admin Profile */}
        <div className="admin-card" onClick={() => setShowProfile(true)}>
          <div className="profile-info">
            <h4>{profile.fullName}</h4>
            <p>{profile.role.toUpperCase()}</p>
          </div>
          <img
            src={profile.profilePicture || defaultProfileAvatar}
            alt={profile.fullName}
            className="profile-avatar"
          />
        </div>
      </div>

      {/* Right Side Notification Drawer */}
      {showNotifications && (
        <div className="notif-drawer-backdrop" onClick={() => setShowNotifications(false)}>
          <div
            className="notif-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notif-drawer-header">
              <div className="notif-title-group">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <span className="notif-count-pill">{unreadCount} New</span>
                )}
              </div>
              <div className="notif-header-actions">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="mark-all-read-btn"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  className="notif-close-btn"
                  onClick={() => setShowNotifications(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="notif-drawer-body">
              {loadingNotifications ? (
                <div className="notif-loading-state">
                  <div className="notifications-spinner"></div>
                  <p>Fetching notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="notif-empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <p>No notifications at the moment</p>
                </div>
              ) : (
                <div className="notif-list">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notif-item ${item.isRead ? "read" : "unread"}`}
                      onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                    >
                      <div className="notif-item-left">
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="notif-item-content">
                        <div className="notif-item-top">
                          <h4 className="notif-item-title">{item.title}</h4>
                          <span className="notif-item-time">{formatTimeAgo(item.createdAt)}</span>
                        </div>
                        <p className="notif-item-msg">{item.message}</p>
                      </div>
                      {!item.isRead && <span className="notif-unread-dot" title="Unread"></span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <h2>Admin Profile</h2>
            <div className="profile-details">
              <div className="profile-pic-edit">
                <img
                  src={profile.profilePicture || defaultProfileAvatar}
                  alt={profile.fullName}
                />
              </div>
              <label>
                Name:
                <input type="text" readOnly value={profile.fullName} />
              </label>
              <label>
                Email:
                <input type="email" readOnly value="elena.thorne@redshan360.com" />
              </label>
              <label>
                Role:
                <input type="text" readOnly value={profile.role} />
              </label>
            </div>
            <div className="modal-actions" style={{ display: "flex", gap: "10px" }}>
              <button className="close-btn" style={{ flex: 1 }} onClick={() => setShowProfile(false)}>Close</button>
              <button
                className="close-btn"
                style={{ flex: 1, backgroundColor: "#c0392b", color: "#fff", border: "none" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTopbar;
