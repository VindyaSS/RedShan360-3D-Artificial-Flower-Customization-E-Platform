import React from "react";
import "./AdminCustomerInsights.css";

function AdminCustomerInsights({ customerData }) {
  if (!customerData) return null;

  return (
    <div className="customer-insights-card">
      <div className="insights-header">
        <h3>Customer Insights</h3>
      </div>

      <div className="insights-grid">
        <div className="insight-subcard">
          <span className="insight-label">NEW</span>
          <h2 className="insight-number">{customerData.newCustomers}</h2>
        </div>

        <div className="insight-subcard highlighted">
          <span className="insight-label">ACTIVE</span>
          <h2 className="insight-number">{customerData.activeCustomers}</h2>
        </div>

        <div className="insight-subcard">
          <span className="insight-label">RETURN</span>
          <h2 className="insight-number">{customerData.returningCustomers}</h2>
        </div>
      </div>
    </div>
  );
}

export default AdminCustomerInsights;
