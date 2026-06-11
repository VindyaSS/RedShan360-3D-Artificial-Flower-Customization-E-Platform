import "./AdminUserTable.css";

function AdminUserTable({ activeTab }) {
  const customers = [
    { name: "John Silva", contact: "john@gmail.com | 0771234567", status: "Active" },
    { name: "Nimal Perera", contact: "nimal@gmail.com | 0712345678", status: "Inactive" },
  ];

  const managers = [
    { name: "Kasun Fernando", contact: "kasun@redshan360.com | 0761234567", status: "Active" },
    { name: "Amila Jayasinghe", contact: "amila@redshan360.com | 0759876543", status: "Suspended" },
  ];

  const employees = [
    { name: "Saman Kumara", contact: "saman@redshan360.com | 0774445566", status: "Active" },
    { name: "Ruwan Silva", contact: "ruwan@redshan360.com | 0718899776", status: "Inactive" },
  ];

  let data = [];
  if (activeTab === "customers") data = customers;
  else if (activeTab === "managers") data = managers;
  else data = employees;

  return (
    <div className="admin-user-table-container">
      <table className="admin-user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact Information</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.contact}</td>
              <td>
                <select defaultValue={user.status} className="status-dropdown">
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="view-btn">👁 View</button>
                  <button className="edit-btn">✏️ Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserTable;
