import React, { useState } from "react";
import { UserPlus, Pencil, Check, Briefcase, PackagePlus, ChevronDown, ChevronUp } from "lucide-react";
import "./AdminDashboardLiveActivity.css";

function LiveActivity({ data, loading }) {
  const [visibleCount, setVisibleCount] = useState(5);

  const fallbackActivities = [
    {
      type: "employee",
      title: "Employee Added",
      description: "Nicolas Roche joined the Logistics team.",
      time: "2 mins ago",
    },
    {
      type: "product",
      title: "Product Updated",
      description: "'Silk Velvet Orchid' inventory updated by 50.",
      time: "45 mins ago",
    },
    {
      type: "task",
      title: "Employee Assigned to Work",
      description: "Manager assigned Order #RS-96 to Employee Kamal.",
      time: "1 hour ago",
    },
    {
      type: "order",
      title: "Order Completed",
      description: "#RS-2091 has been shipped and marked done.",
      time: "2 hours ago",
    },
    {
      type: "product",
      title: "New Product Added",
      description: "Manager added 'Royal Peony Crown' to catalog.",
      time: "5 hours ago",
    },
    {
      type: "employee",
      title: "Manager Added",
      description: "Sara Perera registered as Senior Manager.",
      time: "8 hours ago",
    },
    {
      type: "task",
      title: "Employee Assigned to Work",
      description: "Manager assigned Order #RS-95 to Employee Nimal.",
      time: "12 hours ago",
    },
    {
      type: "order",
      title: "Order Completed",
      description: "Order #RS-1088 marked completed.",
      time: "1 day ago",
    }
  ];

  const rawActivities = (data && data.length > 0) ? data : fallbackActivities;
  const displayedActivities = rawActivities.slice(0, visibleCount);
  const hasMore = visibleCount < rawActivities.length;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  const getStyleAndIcon = (act) => {
    const t = (act.type || act.activityType || "").toLowerCase();
    const title = (act.title || "").toLowerCase();

    if (t.includes("employee") || t.includes("user") || title.includes("employee") || title.includes("manager")) {
      return {
        icon: UserPlus,
        iconBg: "#fdf2f2",
        iconColor: "#ec4899",
      };
    } else if (t.includes("product") || title.includes("product")) {
      if (title.includes("added") || title.includes("new")) {
        return {
          icon: PackagePlus,
          iconBg: "#eef2ff",
          iconColor: "#6366f1",
        };
      }
      return {
        icon: Pencil,
        iconBg: "#f3f4f6",
        iconColor: "#4b5563",
      };
    } else if (t.includes("task") || title.includes("assigned") || title.includes("work")) {
      return {
        icon: Briefcase,
        iconBg: "#fef3c7",
        iconColor: "#d97706",
      };
    } else if (t.includes("order") || title.includes("completed")) {
      return {
        icon: Check,
        iconBg: "#f5eae8",
        iconColor: "#7a5255",
      };
    }

    return {
      icon: Check,
      iconBg: "#f3f4f6",
      iconColor: "#6b7280",
    };
  };

  return (
    <div className={`live-activity ${loading ? "loading" : ""}`}>
      <div className="live-activity-header">
        <h3>Live Activity</h3>
        <span className="activity-count-badge">{rawActivities.length} Events</span>
      </div>

      <div className="timeline">
        {displayedActivities.map((activity, index) => {
          const { icon: IconComponent, iconBg, iconColor } = getStyleAndIcon(activity);
          return (
            <div className="timeline-item" key={activity.id || index}>
              <div className="timeline-badge-container">
                <div
                  className="timeline-badge"
                  style={{ backgroundColor: iconBg, color: iconColor }}
                >
                  <IconComponent size={14} strokeWidth={2.5} />
                </div>
                {index < displayedActivities.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="timeline-content">
                <h4 className="timeline-title">{activity.title}</h4>
                <p className="timeline-desc">{activity.description}</p>
                <span className="timeline-time">{activity.time || "Just now"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="see-more-container">
          <button className="see-more-btn" onClick={handleSeeMore}>
            <span>See More</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {!hasMore && rawActivities.length > 5 && (
        <div className="see-more-container">
          <button className="see-more-btn show-less" onClick={handleShowLess}>
            <span>Show Less</span>
            <ChevronUp size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default LiveActivity;
