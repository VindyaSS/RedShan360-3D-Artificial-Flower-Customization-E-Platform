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

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="admin-dashboard-page">
      <AdminSidebar />
      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <h1>Bonjour, Claire.</h1>
          <p>Here is what's happening with RedShan360 today.</p>
        </div>

        <AdminDashboardKPI data={kpiData} loading={loading} />

        {/* Charts + Order Segmentation + Live Activity */}
        <div className="dashboard-grid">
          <div className="dashboard-left">
            <AdminDashboardCharts />
            <AdminDashboardRecentOrders />
          </div>

          <div className="dashboard-right">
            <AdminDashboardOrderSegmentation />
            <AdminDashboardLiveActivity />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
