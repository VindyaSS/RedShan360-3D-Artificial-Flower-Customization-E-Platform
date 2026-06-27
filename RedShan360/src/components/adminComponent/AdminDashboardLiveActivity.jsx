import { UserPlus, Pencil, Check } from "lucide-react";
import "./AdminDashboardLiveActivity.css";

function LiveActivity() {
  const activities = [
    {
      type: "employee",
      title: "Employee Added",
      description: "Nicolas Roche joined the Logistics team.",
      time: "2 mins ago",
      icon: UserPlus,
      iconBg: "#fdf2f2",
      iconColor: "#ec4899",
    },
    {
      type: "product",
      title: "Product Updated",
      description: "'Silk Velvet Orchid' inventory increased by 50.",
      time: "45 mins ago",
      icon: Pencil,
      iconBg: "#f3f4f6",
      iconColor: "#4b5563",
    },
    {
      type: "order",
      title: "Order Completed",
      description: "#RS-2091 has been shipped and marked done.",
      time: "1 hour ago",
      icon: Check,
      iconBg: "#f5eae8",
      iconColor: "#7a5255",
    },
  ];

  return (
    <div className="live-activity">
      <h3>Live Activity</h3>
      <div className="timeline">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div className="timeline-item" key={index}>
              <div className="timeline-badge-container">
                <div
                  className="timeline-badge"
                  style={{ backgroundColor: activity.iconBg, color: activity.iconColor }}
                >
                  <IconComponent size={14} strokeWidth={2.5} />
                </div>
                {index < activities.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="timeline-content">
                <h4 className="timeline-title">{activity.title}</h4>
                <p className="timeline-desc">{activity.description}</p>
                <span className="timeline-time">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LiveActivity;

