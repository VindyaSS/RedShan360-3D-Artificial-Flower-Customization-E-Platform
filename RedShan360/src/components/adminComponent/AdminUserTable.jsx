import React from "react";
import "./AdminUserTable.css";

function AdminUserTable({ activeTab, data, onView, onEdit, onDelete }) {
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getInitialsColorClass = (index) => {
    // Return alternating background classes for initials bubble
    const classes = ["initials-rose", "initials-grey", "initials-coral", "initials-brown"];
    return classes[index % classes.length];
  };

  return (
    <div className="admin-user-table-container">
      {data.length === 0 ? (
        <div className="table-placeholder">
          <h3>No {activeTab} found</h3>
          <p>Try refining your search query or add a new record.</p>
        </div>
      ) : (
        <table className="admin-user-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>CONTACT INFORMATION</th>
              <th>STATUS</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user, index) => {
              const email = user.contact.split(" | ")[0] || "";
              const phone = user.contact.split(" | ")[1] || "";
              const initials = getInitials(user.name);

              return (
                <tr key={user.id}>
                  {/* Name cell with initials avatar & sub-label type */}
                  <td>
                    <div className="user-details-cell">
                      <div className={`user-initials-bubble ${getInitialsColorClass(index)}`}>
                        {initials}
                      </div>
                      <div className="user-meta">
                        <span className="user-name">{user.name}</span>
                        <span className="user-type">{user.type}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact info cell divided on two lines */}
                  <td>
                    <div className="contact-info-cell">
                      <span className="contact-email">{email}</span>
                      {phone && <span className="contact-phone">{phone}</span>}
                    </div>
                  </td>

                  {/* Status cell formatted as pill */}
                  <td>
                    <span className={`status-pill ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>

                  {/* Action SVG buttons (Eye, Pencil, Trash) */}
                  <td className="text-right">
                    <div className="row-action-buttons">
                      {/* View Action */}
                      <button
                        className="action-icon-btn view"
                        onClick={() => onView(user)}
                        title="View Details"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>

                      {/* Edit Action - Only show if not Customer */}
                      {activeTab !== "customers" && (
                        <button
                          className="action-icon-btn edit"
                          onClick={() => onEdit(user)}
                          title="Edit"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}

                      {/* Delete Action */}
                      <button
                        className="action-icon-btn delete"
                        onClick={() => onDelete(user)}
                        title="Delete"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUserTable;
