import React from 'react';
import { ClipboardList, LogOut } from 'lucide-react';
import '../../css/employee.css';

export default function ESideNavigation() {
  const currentPath = window.location.pathname;

  return (
    <aside className="employee-sidebar">
      <div className="profile">
        <h3>Employee Dashboard</h3>
        <h3>Kamal</h3>
      </div>
      <nav>
        <ul>
          <li>
            <a 
              href="/employeeDashboard" 
              className={currentPath === '/employeeDashboard' || currentPath === '/employeeDashboard/' ? 'active' : ''}
            >
              <ClipboardList size={22} color="rgb(68, 43, 45)" />
              My Normal Order Task
            </a>
          </li>
          <li>
            <a 
              href="/eCustomizedProducts" 
              className={currentPath === '/eCustomizedProducts' || currentPath === '/eCustomizedProducts/' ? 'active' : ''}
            >
              <ClipboardList size={22} color="rgb(68, 43, 45)" />
              My Customized Order Task
            </a>
          </li>
        </ul>
      </nav>
      <div className="logout">
        <a href="/login">
          <LogOut size={22} color="rgb(68, 43, 45)" />
          Logout
        </a>
      </div>
    </aside>
  );
}
