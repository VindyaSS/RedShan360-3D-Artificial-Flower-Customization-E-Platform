import "./AdminOrderManagement.css";
import AdminSidebar from "../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../components/adminComponent/AdminTopbar";
import { useState, useEffect } from "react";
import viewIcon from "../../assets/adminView.png";
import api from "../../services/api";
import { getProductImageUrl } from "../../utils/imageHelper";

function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ pending: 0, processing: 0, completed: 0, dispatched: 0 });
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("All Orders");
  const [sortOption, setSortOption] = useState("Sort by: Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modal State for Order Details
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Helper mapper for status display
  const mapOrderStatusLabel = (backendStatus) => {
    if (!backendStatus) return "Pending";
    const statusUpper = backendStatus.toUpperCase();
    if (statusUpper === "ORDER_CONFIRMED" || statusUpper === "PENDING") return "Pending";
    if (statusUpper === "PROCESSING") return "Processing";
    if (statusUpper === "ORDER_COMPLETED" || statusUpper === "COMPLETED") return "Completed";
    if (statusUpper === "DISPATCHED_TO_COURIER" || statusUpper === "DISPATCHED") return "Dispatched to Courier";
    return backendStatus;
  };

  const getStatusClass = (backendStatus) => {
    if (!backendStatus) return "pending";
    const statusUpper = backendStatus.toUpperCase();
    if (statusUpper === "ORDER_CONFIRMED" || statusUpper === "PENDING") return "pending";
    if (statusUpper === "PROCESSING") return "processing";
    if (statusUpper === "ORDER_COMPLETED" || statusUpper === "COMPLETED") return "completed";
    if (statusUpper === "DISPATCHED_TO_COURIER" || statusUpper === "DISPATCHED") return "dispatched";
    return "pending";
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (newStatus === "DISPATCHED_TO_COURIER") {
        await api.put(`/api/orders/${orderId}/dispatch`);
      } else {
        await api.put(`/api/admin/orders/${orderId}/status?status=${newStatus}`);
      }

      setOrders((prevOrders) =>
        prevOrders.map((o) => {
          if (o.rawId === orderId) {
            return {
              ...o,
              rawStatus: newStatus,
              status: mapOrderStatusLabel(newStatus),
            };
          }
          return o;
        })
      );

      if (selectedOrderDetails && selectedOrderDetails.orderId === orderId) {
        setSelectedOrderDetails((prev) => ({
          ...prev,
          orderStatus: newStatus,
        }));
      }

      fetchOrderStats();
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert(error?.response?.data?.message || "Failed to update order status.");
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await api.get("/api/admin/orders/stats");
      if (response.data) {
        setStats({
          pending: response.data.pending || 0,
          processing: response.data.processing || 0,
          completed: response.data.completed || 0,
          dispatched: response.data.dispatched || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching admin order stats:", error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      await fetchOrderStats();
      const response = await api.get("/api/admin/orders");
      const data = response.data || [];

      const formatted = data.map((o) => ({
        id: `#RS-${String(o.orderId).padStart(5, "0")}`,
        rawId: o.orderId,
        customer: o.customerName || "Guest User",
        email: o.customerEmail || "N/A",
        amountVal: Number(o.totalAmount || 0),
        amount: `Rs. ${Number(o.totalAmount || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        status: mapOrderStatusLabel(o.orderStatus),
        rawStatus: o.orderStatus,
        isCustom: Boolean(o.isCustom),
        date: o.orderDate ? new Date(o.orderDate) : new Date(),
      }));

      setOrders(formatted);
    } catch (error) {
      console.error("Error fetching orders list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open Details Modal and fetch full order details
  const handleOpenDetailsModal = async (orderId) => {
    setIsDetailsModalOpen(true);
    setLoadingDetails(true);
    setSelectedOrderDetails(null);
    try {
      const response = await api.get(`/api/admin/orders/${orderId}`);
      setSelectedOrderDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      alert("Failed to load order details from backend.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const [secondDropdownSelection, setSecondDropdownSelection] = useState("All Orders");

  // Filter & Sorting logic
  const getFilteredAndSortedOrders = () => {
    let result = [...orders];

    // 1. First dropdown filter (All Orders / Custom Orders)
    if (filterType === "Custom Orders") {
      result = result.filter(
        (o) => o.isCustom === true || o.id.includes("CST") || (o.rawStatus && o.rawStatus.includes("CUSTOM"))
      );
    }

    // 2. Second dropdown filter (Today, Last 7 Days, Last Month, Processing List, Completed List, Dispatched List)
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonthDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (secondDropdownSelection === "Today") {
      result = result.filter((o) => o.date >= startOfToday);
    } else if (secondDropdownSelection === "Last 7 Days") {
      result = result.filter((o) => o.date >= sevenDaysAgo);
    } else if (secondDropdownSelection === "Last Month") {
      result = result.filter((o) => o.date >= lastMonthDate);
    } else if (secondDropdownSelection === "Processing List") {
      result = result.filter((o) => o.status === "Processing" || o.rawStatus === "PROCESSING");
    } else if (secondDropdownSelection === "Completed List") {
      result = result.filter(
        (o) =>
          o.status === "Completed" ||
          o.rawStatus === "COMPLETED" ||
          o.rawStatus === "ORDER_COMPLETED"
      );
    } else if (secondDropdownSelection === "Dispatched List") {
      result = result.filter(
        (o) =>
          o.status === "Dispatched to Courier" ||
          o.rawStatus === "DISPATCHED_TO_COURIER" ||
          o.rawStatus === "DISPATCHED"
      );
    }

    // Sort by date: Newest orders on top
    result.sort((a, b) => b.date - a.date);

    return result;
  };

  const processedOrders = getFilteredAndSortedOrders();

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = processedOrders.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(processedOrders.length / rowsPerPage) || 1;

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

        {/* Dynamic KPI Cards */}
        <div className="order-kpi-grid">
          <div className="order-kpi-card pending">
            <h4>Pending</h4>
            <h2>{stats.pending.toLocaleString()}</h2>
          </div>
          <div className="order-kpi-card processing">
            <h4>Processing</h4>
            <h2>{stats.processing.toLocaleString()}</h2>
          </div>
          <div className="order-kpi-card completed">
            <h4>Completed</h4>
            <h2>{stats.completed.toLocaleString()}</h2>
          </div>
          <div className="order-kpi-card dispatched">
            <h4>Dispatched to Courier</h4>
            <h2>{stats.dispatched.toLocaleString()}</h2>
          </div>
        </div>

        {/* Filters + Actions */}
        <div className="order-actions">
          <select
            className="order-filter"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All Orders">All Orders</option>
            <option value="Custom Orders">Custom Orders</option>
          </select>

          <select
            className="order-sort"
            value={secondDropdownSelection}
            onChange={(e) => {
              setSecondDropdownSelection(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All Orders">All Orders</option>
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last Month">Last Month</option>
            <option value="Processing List">Processing List</option>
            <option value="Completed List">Completed List</option>
            <option value="Dispatched List">Dispatched List</option>
          </select>

          <button className="export-btn" onClick={fetchOrders}>
            Refresh
          </button>
        </div>

        {/* Orders Table */}
        <div className="orders-table">
          <h3>Recent Global Orders</h3>
          {loading ? (
            <p style={{ padding: "20px" }}>Loading real-time orders...</p>
          ) : currentRows.length === 0 ? (
            <p style={{ padding: "20px" }}>No orders found in the database.</p>
          ) : (
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
                        {order.email && <span className="email">{order.email}</span>}
                      </div>
                    </td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`status ${getStatusClass(order.rawStatus)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button title="View Order Details" onClick={() => handleOpenDetailsModal(order.rawId)}>
                        <img src={viewIcon} alt="View" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {isDetailsModalOpen && (
        <div className="order-details-modal-overlay">
          <div className="order-details-modal-wrapper">
            <div className="order-details-modal-header">
              <h2>
                {selectedOrderDetails
                  ? `Order Details (#RS-${String(selectedOrderDetails.orderId).padStart(5, "0")})`
                  : "Order Details"}
              </h2>
              <button
                className="close-modal-btn"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="order-details-modal-body">
              {loadingDetails ? (
                <div className="details-loading-spinner">
                  <p>Fetching full order information...</p>
                </div>
              ) : selectedOrderDetails ? (
                <>
                  {/* Grid section 1: Customer Details & Staff Assignment */}
                  <div className="details-cards-grid">
                    {/* Customer Details */}
                    <div className="details-info-card">
                      <h3>Customer Information</h3>
                      <div className="info-row">
                        <span className="info-label">Customer Name:</span>
                        <span className="info-value">{selectedOrderDetails.customerName || "Guest User"}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email Address:</span>
                        <span className="info-value">{selectedOrderDetails.customerEmail || "N/A"}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phone Number:</span>
                        <span className="info-value">{selectedOrderDetails.customerPhone || "N/A"}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Delivery Address:</span>
                        <span className="info-value">{selectedOrderDetails.customerAddress || "Standard Shipping"}</span>
                      </div>
                    </div>

                    {/* Staff & Assignment Status */}
                    <div className="details-info-card">
                      <h3>Assignment & Status</h3>
                      <div className="info-row">
                        <span className="info-label">Assigned Manager:</span>
                        <span className="info-value manager-badge">
                          {selectedOrderDetails.assignedManagerName || "Not Assigned"}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Assigned Employee:</span>
                        <span className="info-value employee-badge">
                          {selectedOrderDetails.assignedEmployeeName || "Unassigned"}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Working Status:</span>
                        <span className="info-value working-status">
                          {selectedOrderDetails.workingStatus || "Not Yet Start Working"}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Order Status:</span>
                        <span className={`status ${getStatusClass(selectedOrderDetails.orderStatus)}`}>
                          {mapOrderStatusLabel(selectedOrderDetails.orderStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grid section 2: Payment & Financial Info */}
                  <div className="details-cards-grid" style={{ marginTop: "15px" }}>
                    <div className="details-info-card full-width">
                      <h3>Financial & Payment Info</h3>
                      <div className="info-row-inline">
                        <div>
                          <span className="info-label">Order Date:</span>
                          <span className="info-value">
                            {selectedOrderDetails.orderDate
                              ? new Date(selectedOrderDetails.orderDate).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="info-label">Payment Status:</span>
                          <span className="info-value">{selectedOrderDetails.paymentStatus || "PENDING"}</span>
                        </div>
                        <div>
                          <span className="info-label">Payment Method:</span>
                          <span className="info-value">{selectedOrderDetails.paymentMethod || "N/A"}</span>
                        </div>
                        <div>
                          <span className="info-label">Total Amount:</span>
                          <span className="info-value amount-highlight">
                            Rs. {Number(selectedOrderDetails.totalAmount || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="details-items-section">
                    <h3>Order Items</h3>
                    {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                      <table className="modal-items-table">
                        <thead>
                          <tr>
                            <th>ITEM</th>
                            <th>QUANTITY</th>
                            <th>UNIT PRICE</th>
                            <th>LINE TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrderDetails.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="item-name-cell">
                                <img
                                  src={getProductImageUrl(item.imageUrl)}
                                  alt={item.productName}
                                  className="item-thumb"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/images/product-placeholder.png";
                                  }}
                                />
                                <span>{item.productName}</span>
                              </td>
                              <td>{item.quantity}</td>
                              <td>Rs. {Number(item.price || 0).toLocaleString()}</td>
                              <td>Rs. {Number(item.lineTotal || 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-items-text">No individual line items record found.</p>
                    )}
                  </div>

                  {/* Customized 3D Bouquet Snapshot if available */}
                  {selectedOrderDetails.bouquetSnapshot && (
                    <div className="details-items-section 3d-snapshot">
                      <h3>3D Custom Bouquet Details</h3>
                      <div className="snapshot-details-grid">
                        <p><strong>Style:</strong> {selectedOrderDetails.bouquetSnapshot.bouquetStyle || "ROUND"}</p>
                        <p><strong>Wrapper Color:</strong> {selectedOrderDetails.bouquetSnapshot.wrapperColor || "N/A"}</p>
                        <p><strong>Ribbon Color:</strong> {selectedOrderDetails.bouquetSnapshot.ribbonColor || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p>No details found for this order.</p>
              )}
            </div>

            <div className="order-details-modal-footer">
              <button
                className="btn-close-modal"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrderManagement;
