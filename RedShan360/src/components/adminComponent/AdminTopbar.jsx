import "./AdminTopbar.css";
import { useState } from "react";
import searchIcon from "../../assets/adminSearch.png";
import notificationIcon from "../../assets/adminNotification.png";
import settingsIcon from "../../assets/adminSetting.png";

function AdminTopbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // ✅ renamed and defined

  return (
    <div className="admin-topbar">

      {/* Search Bar */}
      <div className="topbar-search">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search orders, users, or products..."
        />
      </div>

      {/* Right Side Actions */}
      <div className="topbar-actions">

        {/* Notifications */}
        <a href="/notifications" className="icon-btn notification">
          <img src={notificationIcon} alt="Notifications" />
          {notificationCount > 0 && (
            <span className="badge">{notificationCount}</span>
          )}
        </a>

        {/* Settings */}
        <a href="/settings" className="icon-btn">
          <img src={settingsIcon} alt="Settings" />
        </a>

        {/* Admin Profile */}
        <div className="admin-card" onClick={() => setShowProfile(true)}>
          <div className="profile-image">A</div>
          <div className="profile-info">
            <h4>Admin User</h4>
            <p>Administrator</p>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <h2>Admin Profile</h2>
            <div className="profile-details">
              <div className="profile-pic-edit">
                <img src="/images/profile-placeholder.png" alt="Profile" />
                <button className="edit-btn">Change Image</button>
              </div>
              <label>
                Name:
                <input type="text" defaultValue="Admin User" />
              </label>
              <label>
                Email:
                <input type="email" defaultValue="admin@redshan360.com" />
              </label>
              <label>
                Phone:
                <input type="text" defaultValue="0771234567" />
              </label>
              <label>
                Role:
                <input type="text" defaultValue="Administrator" />
              </label>
            </div>
            <div className="modal-actions">
              <button className="save-btn">Save Changes</button>
              <button className="close-btn" onClick={() => setShowProfile(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTopbar;
