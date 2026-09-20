import "./AdminDashboardRecentOrders.css";

function RecentOrders({ data, loading }) {
  // Muted luxury theme avatar colors
  const avatarColors = [
    { bg: "#f3e8e8", text: "#8a6365" }, // Muted rose
    { bg: "#eef2f7", text: "#4a5d6e" }, // Muted blue
    { bg: "#edf7ed", text: "#2e7d32" }, // Muted green
    { bg: "#fff4e5", text: "#663c00" }, // Muted orange
    { bg: "#f3e5f5", text: "#6a1b9a" }, // Muted purple
  ];

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColors = (name) => {
    if (!name) return avatarColors[0];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return avatarColors[sum % avatarColors.length];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusDetails = (status) => {
    if (!status) return { label: "PENDING", className: "pending" };
    switch (status.toUpperCase()) {
      case "ORDER_COMPLETED":
      case "COMPLETED":
        return { label: "COMPLETED", className: "completed" };
      case "DISPATCHED_TO_COURIER":
      case "DISPATCHED":
        return { label: "DISPATCHED TO COURIER", className: "dispatched" };
      case "PROCESSING":
        return { label: "PROCESSING", className: "processing" };
      case "ORDER_CONFIRMED":
      case "PENDING":
      default:
        return { label: "PENDING", className: "pending" };
    }
  };

  // Fallback mock orders
  const mockOrders = [
    {
      id: "#RS-2091",
      customer: "Marc-Antoine Bernard",
      status: "DISPATCHED_TO_COURIER",
      date: "2024-06-12T12:00:00Z",
    },
    {
      id: "#RS-2092",
      customer: "Elena Loft",
      status: "PROCESSING",
      date: "2024-06-11T12:00:00Z",
    },
    {
      id: "#RS-2093",
      customer: "Julian Smith",
      status: "ORDER_CONFIRMED",
      date: "2024-06-11T12:00:00Z",
    },
  ];

  const displayOrders = data || mockOrders;

  return (
    <div className={`recent-orders ${loading ? "loading" : ""}`}>
      <div className="recent-orders-header">
        <h3>Recent Orders</h3>
        <a href="/adminOrderManagement" className="view-all-btn">
          View All
        </a>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>STATUS</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order, index) => {
              const avatar = getAvatarColors(order.customer);
              const initials = getInitials(order.customer);
              const statusDetails = getStatusDetails(order.status);
              
              return (
                <tr key={index}>
                  <td className="order-id">{order.id}</td>
                  <td className="customer-cell">
                    <div
                      className="customer-avatar"
                      style={{ backgroundColor: avatar.bg, color: avatar.text }}
                    >
                      {initials}
                    </div>
                    <span className="customer-name">{order.customer}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${statusDetails.className}`}>
                      {statusDetails.label}
                    </span>
                  </td>
                  <td className="order-date">{formatDate(order.date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;

