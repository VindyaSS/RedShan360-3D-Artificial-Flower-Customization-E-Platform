import "./AdminDashboardKPI.css";

function AdminDashboardKPI() {
  const kpis = [
    { title: "Total Customers", value: "12,840", change: "+12%", status: "positive" },
    { title: "Total Managers", value: "24", change: "+5%", status: "positive" },
    { title: "Total Employees", value: "156", change: "+12%", status: "positive" },
    { title: "Total Products", value: "2,450", change: "Stable", status: "neutral" },
    { title: "Pending Orders", value: "48", change: "Urgent", status: "negative" },
    { title: "Completed Orders", value: "2,142", change: "+18%", status: "positive" },
    { title: "Monthly Revenue", value: "€84,200", change: "+8.4%", status: "positive" },
  ];

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, index) => (
        <div key={index} className={`kpi-card ${kpi.status}`}>
          <h4>{kpi.title}</h4>
          <h2>{kpi.value}</h2>
          <p>{kpi.change}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboardKPI;
