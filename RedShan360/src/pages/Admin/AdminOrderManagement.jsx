import "./AdminOrderManagement.css";
import AdminSidebar from "../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../components/adminComponent/AdminTopbar";
import { useState } from "react";
import viewIcon from "../../assets/adminView.png";
import editIcon from "../../assets/adminEdit.png";
import allocateIcon from "../../assets/adminAllocate.png";

function AdminOrderManagement() {
  // Example data (replace with real orders later)
  const orders = [
    { id: "#RS-88219", customer: "Eleanor Rigby", email: "eleanor@prestige.com", amount: "Rs. 1,450.00", status: "Processing" },
    { id: "#RS-88218", customer: "Maximillian Kaine", email: "max@kaine_estates.uk", amount: "Rs. 450.00", status: "Pending" },
    { id: "#RS-88217", customer: "Sarah Delaunay", email: "sarah.d@vogue.fr", amount: "Rs. 2,700.00", status: "Completed" },
    // ... add more rows for testing
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = orders.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <AdminSidebar />
      <div className="admin-content">
        <AdminTopbar />

        {/* Page Header */}
        <div className="dashboard-header">
          <h1>Order Management</h1>
          <p>Oversee luxury floral distributions and artisanal custom 3D commissions.</p>
        </div>

        {/* KPI Cards */}
        <div className="order-kpi-grid">
          <div className="order-kpi-card pending"><h4>Pending Review</h4><h2>24</h2></div>
          <div className="order-kpi-card processing"><h4>Processing</h4><h2>142</h2></div>
          <div className="order-kpi-card completed"><h4>Completed</h4><h2>1,284</h2></div>
          <div className="order-kpi-card cancelled"><h4>Cancelled</h4><h2>12</h2></div>
        </div>

        {/* Filters + Actions */}
        <div className="order-actions">
          <select className="order-filter">
            <option>All Orders</option>
            <option>Custom Orders</option>
          </select>

          <select className="order-sort">
            <option>Sort by: Newest</option>
            <option>Oldest</option>
            <option>Highest Price</option>
            <option>Lowest Price</option>
            <option>Pending First</option>
            <option>Completed First</option>
          </select>

          <button className="export-btn">Export</button>
        </div>

        {/* Orders Table */}
        <div className="orders-table">
          <h3>Recent Global Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((order, index) => (
                <tr key={index}>
                  <td>{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <span className="name">{order.customer}</span>
                      <span className="email">{order.email}</span>
                    </div>
                  </td>
                  <td>{order.amount}</td>
                  <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                  <td className="actions">
                    <button title="View"><img src={viewIcon} alt="View" /></button>
                    <button title="Edit"><img src={editIcon} alt="Edit" /></button>
                    <button title="Allocate"><img src={allocateIcon} alt="Allocate" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderManagement;
