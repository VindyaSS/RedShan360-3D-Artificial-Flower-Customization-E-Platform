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
      title: "Total Customers",
      value: formatNumber(data?.totalCustomers ?? 12840),
      change: formatPercentage(data?.totalCustomersChange ?? 12),
      status: getStatus(data?.totalCustomersChange ?? 12, "Total Customers")
    },
    {
      title: "Total Managers",
      value: formatNumber(data?.totalManagers ?? 24),
      change: formatPercentage(data?.totalManagersChange ?? 5),
      status: getStatus(data?.totalManagersChange ?? 5, "Total Managers")
    },
    {
      title: "Total Employees",
      value: formatNumber(data?.totalEmployees ?? 156),
      change: formatPercentage(data?.totalEmployeesChange ?? 12),
      status: getStatus(data?.totalEmployeesChange ?? 12, "Total Employees")
    },
    {
      title: "Total Products",
      value: formatNumber(data?.totalProducts ?? 2450),
      change: formatPercentage(data?.totalProductsChange ?? 0),
      status: getStatus(data?.totalProductsChange ?? 0, "Total Products")
    },
    {
      title: "Pending Orders",
      value: formatNumber(data?.pendingOrders ?? 48),
      change: formatPercentage(data?.pendingOrdersChange ?? 15),
      status: getStatus(data?.pendingOrdersChange ?? 15, "Pending Orders")
    },
    {
      title: "Completed Orders",
      value: formatNumber(data?.completedOrders ?? 2142),
      change: formatPercentage(data?.completedOrdersChange ?? 18),
      status: getStatus(data?.completedOrdersChange ?? 18, "Completed Orders")
    },
    {
      title: "Monthly Revenue",
      value: data?.monthlyRevenue !== undefined && data?.monthlyRevenue !== null
        ? `Rs. ${Number(data.monthlyRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "Rs. 84,200.00",
      change: formatPercentage(data?.monthlyChange ?? 8.4),
      status: getStatus(data?.monthlyChange ?? 8.4, "Monthly Revenue")
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
