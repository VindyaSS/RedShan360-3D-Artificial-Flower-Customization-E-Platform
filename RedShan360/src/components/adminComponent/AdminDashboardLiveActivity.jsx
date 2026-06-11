import "./AdminDashboardLiveActivity.css";

function LiveActivity() {
  const activities = [
    { text: "Employee Added – Nicolas Roche joined the Logistics team.", time: "2 mins ago" },
    { text: "Product Updated – 'Silk Velvet Orchid' inventory increased by 50.", time: "45 mins ago" },
    { text: "Order Completed – #RS-2091 has been shipped and marked done.", time: "1 hour ago" },
  ];

  return (
    <div className="live-activity">
      <h3>Live Activity</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <p>{activity.text}</p>
            <span>{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LiveActivity;
