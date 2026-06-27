import React from "react";
import "./AdminOrderFulfillment.css";

function AdminOrderFulfillment({ fulfillmentData }) {
  if (!fulfillmentData) return null;

  const { total, pending, completed, cancelled } = fulfillmentData;

  // Calculate percentages
  const completedPct = total > 0 ? (completed / total) * 100 : 0;
  const pendingPct = total > 0 ? (pending / total) * 100 : 0;
  const cancelledPct = total > 0 ? (cancelled / total) * 100 : 0;

  return (
    <div className="order-fulfillment-card">
      <div className="fulfillment-header">
        <h3>Order Fulfillment</h3>
      </div>

      <div className="fulfillment-stats">
        <div className="stat-col">
          <span className="stat-label">TOTAL</span>
          <span className="stat-value">{total.toLocaleString()}</span>
        </div>
        <div className="stat-col">
          <span className="stat-label">PENDING</span>
          <span className="stat-value pending-text">{pending}</span>
        </div>
        <div className="stat-col">
          <span className="stat-label">DONE</span>
          <span className="stat-value done-text">{completed.toLocaleString()}</span>
        </div>
        <div className="stat-col">
          <span className="stat-label">CXL</span>
          <span className="stat-value cancelled-text">{cancelled}</span>
        </div>
      </div>

      <div className="fulfillment-progress-bar">
        {completedPct > 0 && (
          <div
            className="progress-segment completed"
            style={{ width: `${completedPct}%` }}
            title={`Completed: ${completedPct.toFixed(1)}%`}
          ></div>
        )}
        {pendingPct > 0 && (
          <div
            className="progress-segment pending"
            style={{ width: `${pendingPct}%` }}
            title={`Pending: ${pendingPct.toFixed(1)}%`}
          ></div>
        )}
        {cancelledPct > 0 && (
          <div
            className="progress-segment cancelled"
            style={{ width: `${cancelledPct}%` }}
            title={`Cancelled: ${cancelledPct.toFixed(1)}%`}
          ></div>
        )}
      </div>
    </div>
  );
}

export default AdminOrderFulfillment;
