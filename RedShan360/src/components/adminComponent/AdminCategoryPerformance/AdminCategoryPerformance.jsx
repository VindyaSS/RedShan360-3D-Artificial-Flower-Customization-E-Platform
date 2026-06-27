import React from "react";
import "./AdminCategoryPerformance.css";

function AdminCategoryPerformance({ categoryData }) {
  if (!categoryData) return null;

  return (
    <div className="category-performance-card">
      <div className="category-card-header">
        <h3>Product Category Performance</h3>
      </div>
      
      <div className="category-list">
        {categoryData.map((item, idx) => (
          <div className="category-item" key={idx}>
            <div className="category-info-row">
              <span className="category-name">{item.category}</span>
              <span className="category-percentage">{item.percentage}%</span>
            </div>
            <div className="category-progress-track">
              <div
                className="category-progress-bar"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategoryPerformance;
