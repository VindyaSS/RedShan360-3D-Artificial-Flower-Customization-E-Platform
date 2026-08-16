import React from 'react';
import { ClipboardList, LogOut } from 'lucide-react';
import '../../css/employee.css';

// ---------------- EMPLOYEE SIDE NAVIGATION ----------------
export default function ESideNavigation() {
    const currentPath = window.location.pathname;

    // ---------------- LOGGED-IN EMPLOYEE ----------------
    let loggedInUser = {};

    try {
        loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
        loggedInUser = {};
    }

    // ---------------- EMPLOYEE NAME ----------------
    // Supports common field names that may exist in the login response
    const employeeName =
        loggedInUser?.employeeName ||
        loggedInUser?.name ||
        loggedInUser?.fullName ||
        loggedInUser?.username ||
        'Employee';

    return (
        <aside className="employee-sidebar">

            <div className="profile">
                <h3>Employee Dashboard</h3>
                <h3>Welcome , {employeeName}</h3>
            </div>

            <nav>
                <ul>

                    <li>
                        <a
                            href="/employeeDashboard"
                            className={
                                currentPath === '/employeeDashboard' ||
                                currentPath === '/employeeDashboard/'
                                    ? 'active'
                                    : ''
                            }
                        >
                            <ClipboardList size={22} color="rgb(68, 43, 45)" />
                            My Normal Order Task
                        </a>
                    </li>

                    <li>
                        <a
                            href="/eCustomizedProducts"
                            className={
                                currentPath === '/eCustomizedProducts' ||
                                currentPath === '/eCustomizedProducts/'
                                    ? 'active'
                                    : ''
                            }
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