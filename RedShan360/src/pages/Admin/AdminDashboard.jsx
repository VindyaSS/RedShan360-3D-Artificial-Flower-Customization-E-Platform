import "./AdminDashboard.css";
import AdminSidebar from "../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../components/adminComponent/AdminTopbar";
import AdminDashboardKPI from "../../components/adminComponent/AdminDashboardKPI";
import AdminDashboardCharts from "../../components/adminComponent/AdminDashboardCharts";
import AdminDashboardRecentOrders from "../../components/adminComponent/AdminDashboardRecentOrders";
import AdminDashboardLiveActivity from "../../components/adminComponent/AdminDashboardLiveActivity";
import AdminDashboardOrderSegmentation from "../../components/adminComponent/AdminDashboardOrderSegmentation";

function AdminDashboard() {
  return (
    <div className="admin-dashboard-page">
      <AdminSidebar />
      <div className="admin-content">
        <AdminTopbar />

        <div className="dashboard-header">
          <h1>Bonjour, Claire.</h1>
          <p>Here is what's happening with RedShan360 today.</p>
        </div>

        <AdminDashboardKPI />

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
