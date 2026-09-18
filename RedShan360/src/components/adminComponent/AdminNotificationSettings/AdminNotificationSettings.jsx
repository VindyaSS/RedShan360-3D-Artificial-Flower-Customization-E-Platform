import React, { useState, useEffect } from "react";
import { AdminSettingsService } from "../../../services/AdminSettingsService";
import "./AdminNotificationSettings.css";

function AdminNotificationSettings() {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    newOrderAlerts: true,
    lowStockAlerts: true,
    monthlyReportEmails: false,
    lowStockThreshold: 5,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPrefs = async () => {
      setLoading(true);
      try {
        const data = await AdminSettingsService.getNotifications();
        if (data) {
          setPrefs({
            emailNotifications: data.emailNotifications ?? true,
            newOrderAlerts: data.newOrderAlerts ?? true,
            lowStockAlerts: data.lowStockAlerts ?? true,
            monthlyReportEmails: data.monthlyReportEmails ?? false,
            lowStockThreshold: data.lowStockThreshold ?? 5,
          });
        }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrefs((prev) => ({
      ...prev,
      [name]: name === "lowStockThreshold" ? Math.max(0, parseInt(value, 10) || 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setMessage(null);
    try {
      const res = await AdminSettingsService.updateNotifications(prefs);
      if (res.success || res.data) {
        setMessage({ type: "success", text: res.message || "Notification preferences saved successfully!" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save notification preferences." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
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

      {message && (
        <div className={`notification-alert-box ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="notifications-inputs-form">
        <div className="notifications-list-group">
          {/* Email Notifications */}
          <label className="notification-switch-row">
            <div className="switch-text-block">
              <span className="switch-title">Email Notifications</span>
              <span className="switch-desc">Receive system alerts, password resets, and customer inquiries directly in your inbox.</span>
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
              <span className="switch-desc">Get alerted immediately whenever a new customer order is placed.</span>
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
              <span className="switch-desc">Receive early warnings when flower stock and materials run low.</span>
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

          {/* Low Stock Threshold Field */}
          {prefs.lowStockAlerts && (
            <div className="notification-number-row">
              <div className="switch-text-block">
                <span className="switch-title">Low Stock Threshold Limit</span>
                <span className="switch-desc">Notify me when any product's remaining stock drops to or below this count.</span>
              </div>
              <div className="number-input-wrapper">
                <input
                  type="number"
                  name="lowStockThreshold"
                  min="0"
                  max="1000"
                  value={prefs.lowStockThreshold}
                  onChange={handleInputChange}
                  className="threshold-number-input"
                />
              </div>
            </div>
          )}

          {/* Monthly Report Emails */}
          <label className="notification-switch-row">
            <div className="switch-text-block">
              <span className="switch-title">Monthly Report Emails</span>
              <span className="switch-desc">Automatically receive an end-of-month sales and revenue report via email.</span>
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

