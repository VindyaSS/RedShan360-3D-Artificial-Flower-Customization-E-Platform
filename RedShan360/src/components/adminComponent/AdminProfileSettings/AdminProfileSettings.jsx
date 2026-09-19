import React, { useState, useEffect } from "react";
import AdminProfilePicture from "../AdminProfilePicture/AdminProfilePicture";
import { AdminSettingsService } from "../../../services/AdminSettingsService";
import "./AdminProfileSettings.css";

function AdminProfileSettings() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    profilePicture: null,
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await AdminSettingsService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load settings profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureUpload = async (base64DataUrl) => {
    try {
      const res = await AdminSettingsService.uploadProfilePicture(base64DataUrl);
      if (res.success) {
        setProfile((prev) => ({ ...prev, profilePicture: base64DataUrl }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile picture.");
    }
  };

  const handlePictureDelete = async () => {
    try {
      const res = await AdminSettingsService.deleteProfilePicture();
      if (res.success) {
        setProfile((prev) => ({ ...prev, profilePicture: null }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile picture.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!profile.fullName.trim()) {
      alert("Full name is required.");
      return;
    }
    if (!profile.email.trim()) {
      alert("Email address is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await AdminSettingsService.updateProfile({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
      });
      if (res.success) {
        alert("Changes saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-settings-loading">
        <div className="profile-spinner"></div>
        <p>Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="profile-settings-form-wrapper">
      {/* Dynamic Profile Picture Block */}
      <AdminProfilePicture
        currentPicture={profile.profilePicture}
        onPictureUpload={handlePictureUpload}
        onPictureDelete={handlePictureDelete}
      />

      <form onSubmit={handleSubmit} className="profile-inputs-form">
        <div className="form-fields-grid">
          <div className="form-group">
            <label htmlFor="fullName">FULL NAME</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              placeholder="e.g. Eleanor Thorne"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="e.g. eleanor.thorne@redshan360.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">PHONE NUMBER</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 234-5678"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">ROLE</label>
            <input
              type="text"
              id="role"
              name="role"
              value={profile.role}
              disabled
              className="readonly-field"
            />
          </div>
        </div>

        <div className="form-submit-row">
          <button type="submit" className="save-changes-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProfileSettings;
