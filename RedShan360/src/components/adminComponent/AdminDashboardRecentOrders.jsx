import "./AdminDashboardRecentOrders.css";

function RecentOrders() {
  const orders = [
    {
      id: "#RS-2091",
      customer: "Marc-Antoine Bernard",
      initials: "MB",
      avatarBg: "#e5e7eb",
      avatarColor: "#4b5563",
      status: "COMPLETED",
      date: "12 June, 2024",
    },
    {
      id: "#RS-2092",
      customer: "Elena Loft",
      initials: "EL",
      avatarBg: "#fecaca",
      avatarColor: "#991b1b",
      status: "PROCESSING",
      date: "11 June, 2024",
    },
    {
      id: "#RS-2093",
      customer: "Julian Smith",
      initials: "JS",
      avatarBg: "#e5e7eb",
      avatarColor: "#4b5563",
      status: "PENDING",
      date: "11 June, 2024",
    },
  ];

  return (
    <div className="recent-orders">
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
            {orders.map((order, index) => (
              <tr key={index}>
                <td className="order-id">{order.id}</td>
                <td className="customer-cell">
                  <div
                    className="customer-avatar"
                    style={{ backgroundColor: order.avatarBg, color: order.avatarColor }}
                  >
                    {order.initials}
                  </div>
                  <span className="customer-name">{order.customer}</span>
                </td>
                <td>
                  <span className={`status-pill ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td className="order-date">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;

