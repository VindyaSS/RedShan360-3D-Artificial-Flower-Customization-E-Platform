import React, { useState } from "react";
import { AdminSettingsService } from "../../../services/AdminSettingsService";
import PasswordInput from "../../PasswordInput";
import "./AdminPasswordSettings.css";

function AdminPasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!currentPassword) {
      alert("Current password is required.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    setSaving(true);
    try {
      const res = await AdminSettingsService.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      alert(res?.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to update password:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Failed to update password.";
      alert("Failed to update password: " + (typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="password-settings-wrapper">
      <div className="section-title-row">
        <h3>Change Password</h3>
        <p>Ensure your account is protected with a secure password.</p>
      </div>

      <form onSubmit={handleSubmit} className="password-inputs-form">
        <div className="form-fields-grid-single">
          <div className="form-group">
            <label htmlFor="currentPassword">CURRENT PASSWORD</label>
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">NEW PASSWORD</label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">CONFIRM NEW PASSWORD</label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="form-submit-row">
          <button type="submit" className="save-password-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminPasswordSettings;
