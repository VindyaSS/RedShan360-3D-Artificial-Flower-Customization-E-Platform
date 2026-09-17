import React, { useState } from 'react';
import { ClipboardList, LogOut, Menu, X } from 'lucide-react';
import '../../css/employee.css';

// ---------------- EMPLOYEE SIDE NAVIGATION ----------------
export default function ESideNavigation() {
    const currentPath = window.location.pathname;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ---------------- LOGGED-IN EMPLOYEE ----------------
    let loggedInUser = {};
    try {
        loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
        loggedInUser = {};
    }

    const employeeName =
        loggedInUser?.employeeName ||
        loggedInUser?.name ||
        loggedInUser?.fullName ||
        loggedInUser?.username ||
        'Employee';

    return (
        <>
            {/* Hamburger button — visible only on mobile/tablet */}
            <button
                className="e-hamburger-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            {/* Overlay backdrop — closes sidebar when clicked */}
            {sidebarOpen && (
                <div
                    className="e-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`employee-sidebar${sidebarOpen ? ' e-sidebar-open' : ''}`}>

                {/* Close button inside sidebar — mobile only */}
                <button
                    className="e-sidebar-close-btn"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>

                <div className="profile">
                    <h3>Employee Dashboard</h3>
                    <h3>Welcome, {employeeName}</h3>
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
                                onClick={() => setSidebarOpen(false)}
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
                                onClick={() => setSidebarOpen(false)}
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
        </>
    );
}