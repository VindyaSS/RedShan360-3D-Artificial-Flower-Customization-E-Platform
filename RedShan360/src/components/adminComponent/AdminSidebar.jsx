// import "./AdminSidebar.css";
// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import dashboardIcon from "../../assets/adminDashboard.png";
// import usersIcon from "../../assets/adminUsers.png";
// import productsIcon from "../../assets/adminProducts.png";
// import ordersIcon from "../../assets/adminOrders.png";
// import reportsIcon from "../../assets/adminReports.png";
// import settingsIcon from "../../assets/adminSettings.png";
// function AdminSidebar() {
//   const [showProfile, setShowProfile] = useState(false);

// const menuItems = [
//   {
//     name: "Dashboard",
//     icon: dashboardIcon,
//     path: "/adminDashboard",
//   },
//   {
//     name: "User Management",
//     icon: usersIcon,
//     path: "/adminUserManagement",
//   },
//   {
//     name: "Product Management",
//     icon: productsIcon,
//     path: "/adminProductManagement",
//   },
//   {
//     name: "Order Management",
//     icon: ordersIcon,
//     path: "/adminOrderManagement",
//   },
//   {
//     name: "Reports & Analytics",
//     icon: reportsIcon,
//     path: "/adminReports",
//   },
//   {
//     name: "Settings",
//     icon: settingsIcon,
//     path: "/adminSettings",
//   },
// ];

//   return (
//     <>
//       <div className="admin-sidebar">
//         {/* Logo Section */}
//         <div className="sidebar-logo">
//           <h1>RedShan360</h1>
//           <p>Luxury Admin</p>
//         </div>

//       <div className="sidebar-menu">
//   {menuItems.map((item, index) => (
//     <NavLink
//       key={index}
//       to={item.path}
//       className={({ isActive }) =>
//         isActive ? "menu-item active" : "menu-item"
//       }
//     >
//       <div className="menu-icon">
//         <img src={item.icon} alt={item.name} />
//       </div>

//       <span>{item.name}</span>
//     </NavLink>
//   ))}

//   <div className="menu-item logout">
//     <span>Logout</span>
//   </div>
// </div>
//         {/* Admin Profile */}
//         <div
//           className="admin-profile"
//           onClick={() => setShowProfile(true)}
//         >
//           <div className="profile-image">
//             A
//           </div>

//           <div className="profile-info">
//             <h4>Admin User</h4>
//             <p>Administrator</p>
//           </div>
//         </div>
//       </div>

//       {/* Profile Modal */}
//       {showProfile && (
//         <div className="profile-modal-overlay">
//           <div className="profile-modal">
//             <h2>Admin Profile</h2>

//             <div className="profile-details">
//               <p>
//                 <strong>Name:</strong> Admin User
//               </p>

//               <p>
//                 <strong>Email:</strong> admin@redshan360.com
//               </p>

//               <p>
//                 <strong>Phone:</strong> 0771234567
//               </p>

//               <p>
//                 <strong>Role:</strong> Administrator
//               </p>
//             </div>

//             <button
//               className="close-btn"
//               onClick={() => setShowProfile(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default AdminSidebar;



import "./AdminSidebar.css";
import { NavLink } from "react-router-dom";
import dashboardIcon from "../../assets/adminDashboard.png";
import usersIcon from "../../assets/adminUsers.png";
import productsIcon from "../../assets/adminProducts.png";
import ordersIcon from "../../assets/adminOrders.png";
import reportsIcon from "../../assets/adminReports.png";
import settingsIcon from "../../assets/adminSetting.png"; // ✅ correct filename
import logoutIcon from "../../assets/adminLogout.png";

function AdminSidebar() {
  const menuItems = [
    { name: "Dashboard", icon: dashboardIcon, path: "/adminDashboard" },
    { name: "User Management", icon: usersIcon, path: "/adminUserManagement" },
    { name: "Product Management", icon: productsIcon, path: "/adminProductManagement" },
    { name: "Order Management", icon: ordersIcon, path: "/adminOrderManagement" },
    { name: "Reports & Analytics", icon: reportsIcon, path: "/adminReports" },
    { name: "Settings", icon: settingsIcon, path: "/adminSettings" },
  ];

  return (
    <div className="admin-sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <h1>RedShan360</h1>
        <p>Luxury Admin</p>
      </div>

      {/* Menu */}
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <div className="menu-icon">
              <img src={item.icon} alt={item.name} />
            </div>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout at bottom */}
      <div className="sidebar-logout">
        <div className="menu-item logout">
          <div className="menu-icon">
            <img src={logoutIcon} alt="Logout" />
          </div>
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;



