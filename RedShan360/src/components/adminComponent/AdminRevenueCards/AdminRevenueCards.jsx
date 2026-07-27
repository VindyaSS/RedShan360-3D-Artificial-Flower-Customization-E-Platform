import React from "react";
import "./AdminRevenueCards.css";

function AdminRevenueCards({ data }) {
  if (!data) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const getBarWidth = (changeVal) => {
    const absVal = Math.abs(changeVal);
    return `${Math.min(absVal, 100)}%`;
  };

  const cards = [
    {
      id: "daily",
      label: "DAILY REVENUE",
      value: data.daily.amount,
      change: data.daily.change,
      barWidth: getBarWidth(data.daily.change),
    },
    {
      id: "weekly",
      label: "WEEKLY REVENUE",
      value: data.weekly.amount,
      change: data.weekly.change,
      barWidth: getBarWidth(data.weekly.change),
    },
    {
      id: "monthly",
      label: "MONTHLY REVENUE",
      value: data.monthly.amount,
      change: data.monthly.change,
      barWidth: getBarWidth(data.monthly.change),
    },
  ];

  return (
    <div className="revenue-cards-grid">
      {cards.map((card) => {
        const isPositive = card.change >= 0;
        return (
          <div className="revenue-card" key={card.id}>
            {/* Left Accent Accentuation Bar */}
            <div className="card-left-accent"></div>

            <div className="card-content">
              <div className="card-header-row">
                <span className="card-label">{card.label}</span>
                <span className={`card-change-badge ${isPositive ? "positive" : "negative"}`}>
                  {isPositive ? `+${card.change}%` : `${card.change}%`}
                </span>
              </div>
              <h2 className="card-value">Rs. {formatCurrency(card.value)}</h2>

              {/* Progress visualizer bar at bottom of content */}
              <div className="card-progress-track">
                <div
                  className={`card-progress-fill ${isPositive ? "positive" : "negative"}`}
                  style={{ width: card.barWidth }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminRevenueCards;

