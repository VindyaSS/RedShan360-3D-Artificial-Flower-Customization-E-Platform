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
        setProfile({
          name: data.name || "",
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "ADMIN",
          profilePicture: data.profilePicture || null,
        });
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
    setProfile((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "fullName" || name === "name" ? { name: value, fullName: value } : {}),
    }));
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

    const currentName = profile.fullName || profile.name || "";
    if (!currentName.trim()) {
      alert("Full name is required.");
      return;
    }
    if (!profile.email || !profile.email.trim()) {
      alert("Email address is required.");
      return;
    }

    setSaving(true);
    try {
      const updatedData = await AdminSettingsService.updateProfile({
        name: currentName.trim(),
        email: profile.email.trim(),
        phone: profile.phone ? profile.phone.trim() : "",
      });

      setProfile((prev) => ({
        ...prev,
        name: updatedData.name,
        fullName: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone || "",
        role: updatedData.role || prev.role,
      }));

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Failed to update profile.";
      alert("Failed to update profile: " + (typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)));
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
