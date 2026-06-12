import { useState } from "react";

import AdminSidebar from "../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../components/adminComponent/AdminTopbar";
import AdminUserTable from "../../components/adminComponent/AdminUserTable";
import "./AdminUserManagement.css";

function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState("customers");

  const getButtonText = () => {
    switch (activeTab) {
      case "customers":
        return "Add Customer";

      case "managers":
        return "Add Manager";

      case "employees":
        return "Add Employee";

      default:
        return "Add User";
    }
  };

  return (
    <div className="admin-user-page">

      <AdminSidebar />

      <div className="admin-content">

        <AdminTopbar />

        <div className="user-management-container">

          {/* Header */}

          <div className="page-header">

            <div>
              <h1>User Management</h1>

              <p>
                Manage and monitor customers, managers and employees.
              </p>
            </div>

            <button className="add-user-btn">
              + {getButtonText()}
            </button>

          </div>

          {/* Statistics Cards */}

          <div className="stats-grid">

            <div className="stat-card">
              <h4>Total Customers</h4>
              <h2>1,284</h2>
              <p>+12% from last month</p>
            </div>

            <div className="stat-card">
              <h4>Total Managers</h4>
              <h2>24</h2>
              <p>Active across locations</p>
            </div>

            <div className="stat-card">
              <h4>Total Employees</h4>
              <h2>156</h2>
              <p>Including seasonal staff</p>
            </div>

          </div>

          {/* Tabs */}

          <div className="tab-container">

            <button
              className={activeTab === "customers" ? "tab active" : "tab"}
              onClick={() => setActiveTab("customers")}
            >
              Customers
            </button>

            <button
              className={activeTab === "managers" ? "tab active" : "tab"}
              onClick={() => setActiveTab("managers")}
            >
              Managers
            </button>

            <button
              className={activeTab === "employees" ? "tab active" : "tab"}
              onClick={() => setActiveTab("employees")}
            >
              Employees
            </button>

          </div>

          {/* Search */}

          <div className="table-toolbar">

            <input
              type="text"
              placeholder="Search by name, email or phone..."
            />

          </div>

          {/* Placeholder Table */}

          <AdminUserTable activeTab={activeTab} />

        </div>

      </div>

    </div>
  );
}

export default AdminUserManagement;