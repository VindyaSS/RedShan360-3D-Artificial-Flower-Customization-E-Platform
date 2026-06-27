import React, { useState } from "react";
import AdminSidebar from "../../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../../components/adminComponent/AdminTopbar";
import AdminSettingsMenu from "../../../components/adminComponent/AdminSettingsMenu/AdminSettingsMenu";
import AdminProfileSettings from "../../../components/adminComponent/AdminProfileSettings/AdminProfileSettings";
import AdminPasswordSettings from "../../../components/adminComponent/AdminPasswordSettings/AdminPasswordSettings";
import AdminNotificationSettings from "../../../components/adminComponent/AdminNotificationSettings/AdminNotificationSettings";
import "./AdminSettings.css";

function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderActiveSection = () => {
    switch (activeTab) {
      case "profile":
        return <AdminProfileSettings />;
      case "password":
        return <AdminPasswordSettings />;
      case "notifications":
        return <AdminNotificationSettings />;
      default:
        return <AdminProfileSettings />;
    }
  };

  return (
    <div className="admin-settings-page">
      {/* Sidebar navigation */}
      <AdminSidebar />

      <div className="admin-content">
        {/* Reused global top bar */}
        <AdminTopbar />

        <div className="settings-container">
          {/* Header section with page titles */}
          <div className="settings-header-row">
            <div className="settings-title-block">
              <h1>Admin Settings</h1>
              <p>Manage your luxury account preferences and security protocols.</p>
            </div>
          </div>

          {/* Settings Split Layout Workspace */}
          <div className="settings-workspace-split">
            {/* Left selector menu */}
            <div className="settings-split-left">
              <AdminSettingsMenu
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Right form settings panel */}
            <div className="settings-split-right">
              <div className="settings-content-panel">
                {renderActiveSection()}
              </div>
            </div>
          </div>

          {/* Footer element */}
          <footer className="settings-footer">
            <div className="footer-left">
              <span>RedShan360 &copy; 2024</span>
            </div>
            <div className="footer-right">
              <a href="/privacy" className="footer-link">Privacy Policy</a>
              <a href="/terms" className="footer-link">Terms of Service</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
