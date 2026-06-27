import "./AdminTopbar.css";
import { useState, useEffect } from "react";
import defaultProfileAvatar from "../../assets/default-profile.png";

function AdminTopbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Eleanor Thorne",
    role: "Super Admin",
    profilePicture: null,
  });

  useEffect(() => {
    // Initial fetch from localStorage
    const loadProfile = () => {
      const stored = localStorage.getItem("redshan360_admin_profile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile({
            fullName: parsed.fullName || "Eleanor Thorne",
            role: parsed.role || "Super Admin",
            profilePicture: parsed.profilePicture || null,
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadProfile();

    // Listen for setting changes
    const handleProfileUpdate = (e) => {
      const updated = e.detail;
      setProfile({
        fullName: updated.fullName,
        role: updated.role,
        profilePicture: updated.profilePicture,
      });
    };

    window.addEventListener("adminProfileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("adminProfileUpdated", handleProfileUpdate);
    };
  }, []);

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
          placeholder="Search settings..."
        />
      </div>

      {/* Right Side Actions */}
      <div className="topbar-actions">

        {/* Notifications (Bell) */}
        <a href="/notifications" className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </a>

        {/* Mail Icon */}
        <a href="/messages" className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
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
                <input type="email" readOnly value="eleanor.thorne@redshan360.com" />
              </label>
              <label>
                Role:
                <input type="text" readOnly value={profile.role} />
              </label>
            </div>
            <div className="modal-actions">
              <button className="close-btn" style={{ flex: 1 }} onClick={() => setShowProfile(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTopbar;
