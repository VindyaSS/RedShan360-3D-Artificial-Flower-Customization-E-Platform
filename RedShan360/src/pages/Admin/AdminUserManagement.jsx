import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../components/adminComponent/AdminTopbar";
import AdminUserTable from "../../components/adminComponent/AdminUserTable";
import PasswordInput from "../../components/PasswordInput";
import "./AdminUserManagement.css";

const initialCustomers = [
  { id: 1, name: "Eleanor Abbott", type: "VIP Tier", contact: "e.abbott@example.com | +1 (555) 012-3456", status: "Active" },
  { id: 2, name: "Julian West", type: "Standard", contact: "j.west@luxury.com | +1 (555) 987-6543", status: "Inactive" },
  { id: 3, name: "Seraphina Rose", type: "Corporate Partner", contact: "seraphina@rose.events | +1 (555) 444-2211", status: "Active" },
  { id: 4, name: "Marcus Chen", type: "Flagged Account", contact: "m.chen@techglobal.io | +1 (555) 777-3333", status: "Suspended" },
];

const initialManagers = [
  { id: 101, name: "Kasun Fernando", type: "Sales Manager", contact: "kasun@redshan360.com | 0761234567", status: "Active", employeeId: "EMP-001", department: "Sales", permissions: ["Product Management", "Order Management"], gender: "Male", dob: "1990-05-15", joiningDate: "2023-01-10", addressLine: "No 12, Main Street", city: "Colombo", province: "Western", username: "kasun@redshan360.com" },
  { id: 102, name: "Amila Jayasinghe", type: "Inventory Manager", contact: "amila@redshan360.com | 0759876543", status: "Suspended", employeeId: "EMP-002", department: "Inventory", permissions: ["Product Management"], gender: "Female", dob: "1992-09-21", joiningDate: "2023-06-15", addressLine: "45/A, Kandy Road", city: "Kandy", province: "Central", username: "amila@redshan360.com" },
  { id: 103, name: "Eleanor Thorne", type: "Lead Manager", contact: "eleanor.thorne@redshan360.com | +1 (555) 234-5678", status: "Active", employeeId: "EMP-003", department: "Finance", permissions: ["Product Management", "Order Management"], gender: "Female", dob: "1988-11-04", joiningDate: "2022-04-01", addressLine: "77 Rosewood Gardens", city: "Colombo", province: "Western", username: "eleanor.thorne@redshan360.com" },
];

const initialEmployees = [
  { id: 201, name: "Saman Kumara", type: "Sales Executive", contact: "saman@redshan360.com | 0774445566", status: "Active", employeeId: "EMP-004", department: "Sales", gender: "Male", dob: "1995-02-18", joiningDate: "2024-02-01", addressLine: "88 Orchid Ave", city: "Galle", province: "Southern", username: "saman@redshan360.com" },
  { id: 202, name: "Ruwan Silva", type: "Inventory Staff", contact: "ruwan@redshan360.com | 0718899776", status: "Inactive", employeeId: "EMP-005", department: "Inventory", gender: "Male", dob: "1994-08-30", joiningDate: "2024-05-12", addressLine: "102 Lily Lane", city: "Negombo", province: "Western", username: "ruwan@redshan360.com" },
];

const defaultFormState = {
  fullName: "",
  employeeId: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  role: "Employee",
  department: "",
  jobTitle: "",
  joiningDate: "",
  status: "Active",
  username: "",
  password: "",
  confirmPassword: "",
  addressLine: "",
  city: "",
  province: "",
  permissions: [],
};

// Helper to map backend status to frontend capitalized display status
const mapStatusToFrontend = (backendStatus) => {
  if (!backendStatus) return "Active";
  const statusUpper = backendStatus.toUpperCase();
  if (statusUpper === "ACTIVE") return "Active";
  if (statusUpper === "INACTIVE") return "Inactive";
  if (statusUpper === "SUSPEND" || statusUpper === "SUSPENDED") return "Suspended";
  return backendStatus.charAt(0).toUpperCase() + backendStatus.slice(1).toLowerCase();
};

// Helper mapper
const mapToFrontendFormat = (user) => ({
  id: user.id,
  name: user.name,
  type: user.role === "MANAGER" ? "Manager" : user.role === "EMPLOYEE" ? "Executive" : "Standard",
  contact: `${user.email} | ${user.phone || ""}`,
  status: mapStatusToFrontend(user.status),
  employeeId: user.employeeId || user.managerId || "",
  joiningDate: user.registeredDate ? user.registeredDate.split("T")[0] : ""
});

function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchQuery, setSearchQuery] = useState("");

  // Lists state
  const [customers, setCustomers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Stats state
  const [stats, setStats] = useState({
    totalCustomers: 0,
    customerIncreasePercentage: 0.0,
    totalManagers: 0,
    totalEmployees: 0
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", "view"
  const [formData, setFormData] = useState({ ...defaultFormState });
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchStats = () => {
    fetch("http://localhost:8080/api/admin/users/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  };

  const fetchUsers = () => {
    fetchStats();
    // Fetch Customers
    fetch("http://localhost:8080/api/admin/users?role=CUSTOMER")
      .then(res => res.json())
      .then(data => setCustomers(data.map(mapToFrontendFormat)))
      .catch(err => console.error("Error fetching customers:", err));
    // Fetch Managers
    fetch("http://localhost:8080/api/admin/users?role=MANAGER")
      .then(res => res.json())
      .then(data => setManagers(data.map(mapToFrontendFormat)))
      .catch(err => console.error("Error fetching managers:", err));
    // Fetch Employees
    fetch("http://localhost:8080/api/admin/users?role=EMPLOYEE")
      .then(res => res.json())
      .then(data => setEmployees(data.map(mapToFrontendFormat)))
      .catch(err => console.error("Error fetching employees:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerSearch = (role, query) => {
    fetch(`http://localhost:8080/api/admin/users?role=${role}&search=${query}`)
      .then(res => res.json())
      .then(data => {
        const list = data.map(mapToFrontendFormat);
        if (role === "CUSTOMER") setCustomers(list);
        else if (role === "MANAGER") setManagers(list);
        else setEmployees(list);
      })
      .catch(err => console.error("Error searching users:", err));
  };

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const roleMap = {
      customers: "CUSTOMER",
      managers: "MANAGER",
      employees: "EMPLOYEE"
    };
    const role = roleMap[activeTab];
    triggerSearch(role, searchQuery);
  }, [searchQuery, activeTab]);

  // Auto-generate employee ID
  const generateEmpId = () => {
    const totalCount = managers.length + employees.length + 1;
    return `EMP-${String(totalCount).padStart(3, "0")}`;
  };

  const openAddModal = () => {
    const role = activeTab === "managers" ? "Manager" : "Employee";
    const dateToday = new Date().toISOString().split("T")[0];

    setFormData({
      ...defaultFormState,
      role: role,
      employeeId: generateEmpId(),
      joiningDate: dateToday,
    });
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-set username to email to simplify login
      if (name === "email" && !prev.username) {
        updated.username = value;
      }
      return updated;
    });
  };

  const handlePermissionChange = (perm) => {
    setFormData((prev) => {
      const perms = [...prev.permissions];
      if (perms.includes(perm)) {
        return { ...prev, permissions: perms.filter((p) => p !== perm) };
      } else {
        return { ...prev, permissions: [...perms, perm] };
      }
    });
  };

  const handleResetForm = () => {
    setFormData({
      ...defaultFormState,
      role: activeTab === "managers" ? "Manager" : "Employee",
      employeeId: generateEmpId(),
    });
  };

  const handleFormSave = (e) => {
    e.preventDefault();

    // 1. Validation
    if (!formData.fullName.trim()) {
      alert("Full name cannot be empty.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Email address is required.");
      return;
    }

    // Check unique email (skip current editing user)
    const isEmailTaken =
      customers.some((c) => c.contact.includes(formData.email)) ||
      managers.some((m) => m.contact.includes(formData.email) && m.id !== editingUserId) ||
      employees.some((emp) => emp.contact.includes(formData.email) && emp.id !== editingUserId);

    if (isEmailTaken) {
      alert("Email address already registered in the system.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Phone number is required.");
      return;
    }

    if (modalMode === "add") {
      if (!formData.password) {
        alert("Password is required.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Password and Confirm Password do not match.");
        return;
      }
    }

    if (!formData.role) {
      alert("Role must be selected.");
      return;
    }

    // Create user object
    const contactString = `${formData.email} | ${formData.phone}`;
    const jobTitleLabel = formData.jobTitle || (formData.role === "Manager" ? "Manager" : "Executive");

    const newUserObj = {
      id: modalMode === "edit" ? editingUserId : Date.now(),
      name: formData.fullName,
      type: jobTitleLabel,
      contact: contactString,
      status: formData.status,
      employeeId: formData.employeeId,
      department: formData.department,
      gender: formData.gender,
      dob: formData.dob,
      joiningDate: formData.joiningDate,
      addressLine: formData.addressLine,
      city: formData.city,
      province: formData.province,
      permissions: formData.role === "Manager" ? formData.permissions : [],
      username: formData.username || formData.email,
    };

    if (modalMode === "add") {
      const isManager = formData.role === "Manager";
      const apiUrl = isManager 
        ? "http://localhost:8080/api/admin/users/register-manager"
        : "http://localhost:8080/api/admin/users/register-employee";
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          status: formData.status
        })
      })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          if (data && typeof data === "object" && !data.message) {
            const errorMsgs = Object.entries(data)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(", ");
            throw new Error(errorMsgs || `Failed to register ${formData.role.toLowerCase()}`);
          }
          throw new Error(data.message || `Failed to register ${formData.role.toLowerCase()}`);
        }
        return data;
      })
      .then((data) => {
        const savedUserObj = {
          id: data.id,
          name: data.name,
          type: isManager ? "Manager" : "Executive",
          contact: `${data.email} | ${data.phone || ""}`,
          status: mapStatusToFrontend(data.status),
          employeeId: formData.employeeId,
          department: formData.department,
          gender: formData.gender,
          dob: formData.dob,
          joiningDate: formData.joiningDate,
          addressLine: formData.addressLine,
          city: formData.city,
          province: formData.province,
          permissions: isManager ? formData.permissions : [],
          username: data.email
        };
        if (isManager) {
          setManagers((prev) => [...prev, savedUserObj]);
        } else {
          setEmployees((prev) => [...prev, savedUserObj]);
        }
        fetchStats();
        alert(`${formData.role} registered successfully on backend!`);
        setIsModalOpen(false);
      })
      .catch((error) => {
        alert("Registration Error: " + error.message);
      });
    } else {
      // Edit mode
      fetch(`http://localhost:8080/api/admin/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password || "",
          role: formData.role.toUpperCase(),
          status: formData.status
        })
      })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          if (data && typeof data === "object" && !data.message) {
            const errorMsgs = Object.entries(data)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(", ");
            throw new Error(errorMsgs || "Failed to update user");
          }
          throw new Error(data.message || "Failed to update user");
        }
        return data;
      })
      .then(data => {
        alert("User details updated successfully!");
        setIsModalOpen(false);
        fetchUsers(); // Reload/refresh local lists
      })
      .catch((error) => {
        alert("Update Error: " + error.message);
      });
    }
  };

  // Row Action Handlers
  const handleViewUser = (user, type) => {
    // Populate form data
    const email = user.contact.split(" | ")[0];
    const phone = user.contact.split(" | ")[1] || "";

    setFormData({
      fullName: user.name,
      employeeId: user.employeeId || "",
      email: email,
      phone: phone,
      gender: user.gender || "",
      dob: user.dob || "",
      role: type === "managers" ? "Manager" : type === "employees" ? "Employee" : "Customer",
      department: user.department || "",
      jobTitle: user.type || "",
      joiningDate: user.joiningDate || "",
      status: user.status,
      username: user.username || email,
      password: "",
      confirmPassword: "",
      addressLine: user.addressLine || "",
      city: user.city || "",
      province: user.province || "",
      permissions: user.permissions || [],
    });

    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditUser = (user, type) => {
    if (type === "customers") {
      alert("Customers cannot be edited from this portal.");
      return;
    }

    const email = user.contact.split(" | ")[0];
    const phone = user.contact.split(" | ")[1] || "";

    setFormData({
      fullName: user.name,
      employeeId: user.employeeId || "",
      email: email,
      phone: phone,
      gender: user.gender || "",
      dob: user.dob || "",
      role: type === "managers" ? "Manager" : "Employee",
      department: user.department || "",
      jobTitle: user.type || "",
      joiningDate: user.joiningDate || "",
      status: user.status,
      username: user.username || email,
      password: "",
      confirmPassword: "",
      addressLine: user.addressLine || "",
      city: user.city || "",
      province: user.province || "",
      permissions: user.permissions || [],
    });

    setEditingUserId(user.id);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user, type) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${user.name}?`);
    if (!confirmDelete) return;

    fetch(`http://localhost:8080/api/admin/users/${user.id}`, {
      method: "DELETE"
    })
    .then(res => {
      if (res.ok) {
        alert("User deleted successfully!");
        if (type === "customers") {
          setCustomers((prev) => prev.filter((c) => c.id !== user.id));
        } else if (type === "managers") {
          setManagers((prev) => prev.filter((m) => m.id !== user.id));
        } else {
          setEmployees((prev) => prev.filter((emp) => emp.id !== user.id));
        }
        fetchStats();
      } else {
        alert("Failed to delete user.");
      }
    })
    .catch(err => {
      alert("Error deleting user: " + err.message);
    });
  };

  // Get active items based on activeTab
  const getActiveList = () => {
    if (activeTab === "customers") return customers;
    if (activeTab === "managers") return managers;
    return employees;
  };

  // Filter items based on search query
  const getFilteredList = () => {
    return getActiveList();
  };

  return (
    <div className="admin-user-page">
      <AdminSidebar />

      <div className="admin-content">
        <AdminTopbar />

        <div className="user-management-container">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h1>User Management</h1>
              <p>Manage and monitor roles across your luxury floral enterprise.</p>
            </div>

            {/* Render dynamically: Hide when on Customers tab */}
            {activeTab !== "customers" && (
              <button className="add-user-btn" onClick={openAddModal}>
                + Add {activeTab === "managers" ? "Manager" : "Employee"}
              </button>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            {/* Total Customers Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper customer-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">TOTAL CUSTOMERS</span>
                <h2 className="stat-value">{stats.totalCustomers.toLocaleString()}</h2>
                <div className={`stat-trend ${stats.customerIncreasePercentage >= 0 ? 'positive' : 'negative'}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {stats.customerIncreasePercentage >= 0 ? (
                      <>
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </>
                    ) : (
                      <>
                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                        <polyline points="17 18 23 18 23 12"></polyline>
                      </>
                    )}
                  </svg>
                  <span>
                    {stats.customerIncreasePercentage >= 0 ? "+" : ""}
                    {stats.customerIncreasePercentage.toFixed(0)}% from last month
                  </span>
                </div>
              </div>
            </div>

            {/* Total Managers Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper manager-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M7 17a5 5 0 0 1 10 0"></path>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">TOTAL MANAGERS</span>
                <h2 className="stat-value">{stats.totalManagers}</h2>
              </div>
            </div>

            {/* Total Employees Card */}
            <div className="stat-card">
              <div className="stat-icon-wrapper employee-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                  <path d="M16 8h2"></path>
                  <path d="M16 12h2"></path>
                  <path d="M16 16h2"></path>
                  <path d="M7 14h6a3 3 0 0 0-6 0z"></path>
                  <circle cx="10" cy="9" r="2"></circle>
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-label">TOTAL EMPLOYEES</span>
                <h2 className="stat-value">{stats.totalEmployees}</h2>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-container">
            <button
              className={activeTab === "customers" ? "tab active" : "tab"}
              onClick={() => {
                setActiveTab("customers");
                setSearchQuery("");
              }}
            >
              Customers
            </button>

            <button
              className={activeTab === "managers" ? "tab active" : "tab"}
              onClick={() => {
                setActiveTab("managers");
                setSearchQuery("");
              }}
            >
              Managers
            </button>

            <button
              className={activeTab === "employees" ? "tab active" : "tab"}
              onClick={() => {
                setActiveTab("employees");
                setSearchQuery("");
              }}
            >
              Employees
            </button>
          </div>

          {/* Table Search Toolbar */}
          <div className="table-toolbar">
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* User Table Component */}
          <AdminUserTable
            activeTab={activeTab}
            data={getFilteredList()}
            onView={(user) => handleViewUser(user, activeTab)}
            onEdit={(user) => handleEditUser(user, activeTab)}
            onDelete={(user) => handleDeleteUser(user, activeTab)}
          />
        </div>
      </div>

      {/* Modal Popup Form (Add/Edit/View Manager/Employee) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-wrapper">
            <div className="modal-header">
              <h2>
                {modalMode === "view"
                  ? "View Details"
                  : modalMode === "edit"
                    ? `Edit ${formData.role}`
                    : `Add New ${formData.role}`}
              </h2>
              <button className="close-x-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSave} className="modal-form-body">
              {/* SECTION 1: Personal Information */}
              <div className="form-section">
                <h4 className="section-title">1. Personal Information</h4>
                <div className="form-row-grid">
                  <div className="form-group-item">
                    <label>Full Name <span className="req">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                      disabled={modalMode === "view"}
                    />
                  </div>



                  <div className="form-group-item">
                    <label>Email Address <span className="req">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@domain.com"
                      required
                      disabled={modalMode === "view" || modalMode === "edit"}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>Phone Number <span className="req">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      required
                      disabled={modalMode === "view"}
                    />
                  </div>


                </div>
              </div>

              {/* SECTION 2: Employment Information */}
              <div className="form-section">
                <h4 className="section-title">2. Employment Information</h4>
                <div className="form-row-grid">
                  <div className="form-group-item">
                    <label>Role <span className="req">*</span></label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      disabled={modalMode === "view"}
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>



                  <div className="form-group-item">
                    <label>Joining Date <span className="req">*</span></label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      required
                      disabled={modalMode === "view"}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>Employment Status <span className="req">*</span></label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      disabled={modalMode === "view"}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Login Information */}
              {modalMode === "add" && (
                <div className="form-section">
                  <h4 className="section-title">3. Login Information</h4>
                  <div className="form-row-grid">
                    <div className="form-group-item">
                      <label>Password <span className="req">*</span></label>
                      <PasswordInput
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Initial Password"
                        required
                      />
                    </div>

                    <div className="form-group-item">
                      <label>Confirm Password <span className="req">*</span></label>
                      <PasswordInput
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}





              {/* Actions Footer row */}
              <div className="modal-actions-footer">
                {modalMode !== "view" ? (
                  <>
                    <button type="submit" className="btn-modal-save">
                      Save
                    </button>
                    {modalMode === "add" && (
                      <button type="button" className="btn-modal-reset" onClick={handleResetForm}>
                        Reset
                      </button>
                    )}
                    <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn-modal-close" onClick={() => setIsModalOpen(false)}>
                    Close
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUserManagement;