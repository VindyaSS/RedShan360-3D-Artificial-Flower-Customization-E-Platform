import "./AdminDashboardRecentOrders.css";

function RecentOrders() {
  const orders = [
    { id: "#RS-2091", customer: "Marc-Antoine Bernard", status: "Completed", date: "12 June 2024" },
    { id: "#RS-2092", customer: "Elena Loft", status: "Processing", date: "11 June 2024" },
    { id: "#RS-2093", customer: "Julian Smith", status: "Pending", date: "11 June 2024" },
  ];

  return (
    <div className="recent-orders">
      <h3>Recent Orders</h3>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
              <td>{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentOrders;
