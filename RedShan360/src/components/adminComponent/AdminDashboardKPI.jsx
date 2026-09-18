import "./AdminDashboardKPI.css";

function AdminDashboardKPI({ data, loading }) {
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return Number(num).toLocaleString();
  };

  const formatPercentage = (pct) => {
    if (pct === undefined || pct === null) return "Stable";
    const num = Number(pct);
    if (num > 0) return `+${num.toFixed(1)}%`;
    if (num < 0) return `${num.toFixed(1)}%`;
    return "Stable";
  };

  const getStatus = (pct, title) => {
    if (pct === undefined || pct === null || pct === 0) return "neutral";
    const num = Number(pct);
    if (title === "Pending Orders") {
      // For pending orders, more pending orders is negative, fewer is positive
      return num > 0 ? "negative" : "positive";
    }
    return num > 0 ? "positive" : "negative";
  };

  const kpis = [
    {
      title: "Total Managers",
      value: formatNumber(data?.totalManagers),
      change: formatPercentage(data?.totalManagersChange),
      status: getStatus(data?.totalManagersChange, "Total Managers")
    },
    {
      title: "Total Customers",
      value: formatNumber(data?.totalCustomers),
      change: formatPercentage(data?.totalCustomersChange),
      status: getStatus(data?.totalCustomersChange, "Total Customers")
    },
    {
      title: "Total Employees",
      value: formatNumber(data?.totalEmployees),
      change: formatPercentage(data?.totalEmployeesChange),
      status: getStatus(data?.totalEmployeesChange, "Total Employees")
    },
    {
      title: "Total Products",
      value: formatNumber(data?.totalProducts),
      change: formatPercentage(data?.totalProductsChange),
      status: getStatus(data?.totalProductsChange, "Total Products")
    },
    {
      title: "Pending Orders",
      value: formatNumber(data?.pendingOrders),
      change: formatPercentage(data?.pendingOrdersChange),
      status: getStatus(data?.pendingOrdersChange, "Pending Orders")
    },
    {
      title: "Completed Orders",
      value: formatNumber(data?.completedOrders),
      change: formatPercentage(data?.completedOrdersChange),
      status: getStatus(data?.completedOrdersChange, "Completed Orders")
    },
    {
      title: "Monthly Revenue",
      value: `Rs. ${Number(data?.monthlyRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: formatPercentage(data?.monthlyChange),
      status: getStatus(data?.monthlyChange, "Monthly Revenue")
    },
  ];

  return (
    <div className={`kpi-grid ${loading ? "loading" : ""}`}>
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
