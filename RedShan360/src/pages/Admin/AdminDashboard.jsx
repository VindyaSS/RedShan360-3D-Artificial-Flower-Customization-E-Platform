import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import AdminSidebar from "../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../components/adminComponent/AdminTopbar";
import AdminDashboardKPI from "../../components/adminComponent/AdminDashboardKPI";
import AdminDashboardCharts from "../../components/adminComponent/AdminDashboardCharts";
import AdminDashboardRecentOrders from "../../components/adminComponent/AdminDashboardRecentOrders";
import AdminDashboardLiveActivity from "../../components/adminComponent/AdminDashboardLiveActivity";
import AdminDashboardOrderSegmentation from "../../components/adminComponent/AdminDashboardOrderSegmentation";
import { AdminReportService } from "../../services/AdminReportService";

function AdminDashboard() {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic admin name state (from logged-in user in DB user table)
  const [adminName, setAdminName] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        if (parsedUser.name) return parsedUser.name;
        if (parsedUser.fullName) return parsedUser.fullName;
      }
      const stored = localStorage.getItem("redshan360_admin_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.fullName) return parsed.fullName;
      }
    } catch (e) {
      console.error("Error reading admin name:", e);
    }
    return "Admin";
  });

  useEffect(() => {
    let active = true;

    const fetchKPIs = async () => {
      setLoading(true);
      try {
        const data = await AdminReportService.getDashboardKPIs("Last 30 Days");
        if (active) {
          setKpiData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard KPIs", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchKPIs();

    const handleProfileUpdate = (e) => {
      const updated = e.detail;
      if (updated && updated.fullName) {
        setAdminName(updated.fullName.split(" ")[0]);
      }
    };

    window.addEventListener("adminProfileUpdated", handleProfileUpdate);

    return () => {
      active = false;
      window.removeEventListener("adminProfileUpdated", handleProfileUpdate);
    };
  }, []);

  return (
    <div className="admin-dashboard-page">
      <AdminSidebar />
      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <h1>Welcome, {adminName}.</h1>
          <p>Here is what's happening with RedShan360 today.</p>
        </div>

        <AdminDashboardKPI data={kpiData} loading={loading} />

        {/* Charts + Order Segmentation + Live Activity */}
        <div className="dashboard-grid">
          <div className="dashboard-left">
            <AdminDashboardCharts />
            <AdminDashboardRecentOrders data={kpiData?.recentOrders} loading={loading} />
          </div>

          <div className="dashboard-right">
            <AdminDashboardOrderSegmentation data={kpiData} loading={loading} />
            <AdminDashboardLiveActivity data={kpiData?.liveActivities} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
