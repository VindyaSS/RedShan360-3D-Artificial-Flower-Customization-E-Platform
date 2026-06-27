import React, { useState, useEffect } from "react";
import { AdminSettingsService } from "../../../services/AdminSettingsService";
import "./AdminNotificationSettings.css";

function AdminNotificationSettings() {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    newOrderAlerts: true,
    lowStockAlerts: true,
    monthlyReportEmails: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading(true);
      try {
        const data = await AdminSettingsService.getNotifications();
        setPrefs(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleToggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const res = await AdminSettingsService.updateNotifications(prefs);
      if (res.success) {
        alert("Notification preferences saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save notification preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="notifications-settings-loading">
        <div className="notifications-spinner"></div>
        <p>Loading notification preferences...</p>
      </div>
    );
  }

  return (
    <div className="notifications-settings-wrapper">
      <div className="section-title-row">
        <h3>Notification Settings</h3>
        <p>Choose what alerts and summaries you receive via email and system push.</p>
      </div>

      <form onSubmit={handleSubmit} className="notifications-inputs-form">
        <div className="notifications-list-group">
          {/* Email Notifications */}
          <label className="notification-switch-row">
            <div className="switch-text-block">
              <span className="switch-title">Email Notifications</span>
              <span className="switch-desc">Receive core communication updates in your mailbox.</span>
            </div>
            <div className="switch-input-wrapper">
              <input
                type="checkbox"
                checked={prefs.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
              />
              <span className="switch-slider"></span>
            </div>
          </label>

          {/* New Order Alerts */}
          <label className="notification-switch-row">
            <div className="switch-text-block">
              <span className="switch-title">New Order Alerts</span>
              <span className="switch-desc">Get notified immediately when a customer places an order.</span>
            </div>
            <div className="switch-input-wrapper">
              <input
                type="checkbox"
                checked={prefs.newOrderAlerts}
                onChange={() => handleToggle("newOrderAlerts")}
              />
              <span className="switch-slider"></span>
            </div>
          </label>

          {/* Low Stock Alerts */}
          <label className="notification-switch-row">
            <div className="switch-text-block">
              <span className="switch-title">Low Stock Alerts</span>
              <span className="switch-desc">Get warned when popular silk flower materials fall below thresholds.</span>
            </div>
            <div className="switch-input-wrapper">
              <input
                type="checkbox"
                checked={prefs.lowStockAlerts}
                onChange={() => handleToggle("lowStockAlerts")}
              />
              <span className="switch-slider"></span>
            </div>
          </label>

          {/* Monthly Report Emails */}
          <label className="notification-switch-row">
            <div className="switch-text-block">
              <span className="switch-title">Monthly Report Emails</span>
              <span className="switch-desc">Receive a monthly PDF analytical report summary of sales.</span>
            </div>
            <div className="switch-input-wrapper">
              <input
                type="checkbox"
                checked={prefs.monthlyReportEmails}
                onChange={() => handleToggle("monthlyReportEmails")}
              />
              <span className="switch-slider"></span>
            </div>
          </label>
        </div>

        <div className="form-submit-row">
          <button type="submit" className="save-notifications-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminNotificationSettings;
