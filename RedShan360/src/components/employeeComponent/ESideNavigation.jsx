import React from 'react';
import { ClipboardList, LogOut } from 'lucide-react';
import '../../css/employee.css';

export default function ESideNavigation() {
    const currentPath = window.location.pathname;

    // =========================================================
    // GET LOGGED-IN EMPLOYEE
    // =========================================================

    let loggedInUser = {};

    try {
        loggedInUser = JSON.parse(
            localStorage.getItem('user') || '{}'
        );
    } catch (error) {
        console.error(
            'Failed to read logged-in user:',
            error
        );

        loggedInUser = {};
    }

    // =========================================================
    // GET EMPLOYEE NAME
    // =========================================================
    //
    // Supports the common field names that may exist
    // in your login response.
    //
    const employeeName =
        loggedInUser?.employeeName ||
        loggedInUser?.name ||
        loggedInUser?.fullName ||
        loggedInUser?.username ||
        'Employee';

    return (
        <aside className="employee-sidebar">

            {/* =================================================
                PROFILE
            ================================================= */}

            <div className="profile">

                <h3>
                    Employee Dashboard
                </h3>

                <h3>
                   Welcome , {employeeName}
                </h3>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav>

                <ul>

                    {/* NORMAL ORDER TASK */}

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

                            <ClipboardList
                                size={22}
                                color="rgb(68, 43, 45)"
                            />

                            My Normal Order Task

                        </a>

                    </li>


                    {/* CUSTOMIZED ORDER TASK */}

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

                            <ClipboardList
                                size={22}
                                color="rgb(68, 43, 45)"
                            />

                            My Customized Order Task

                        </a>

                    </li>

                </ul>

            </nav>


            {/* =================================================
                LOGOUT
            ================================================= */}

            <div className="logout">

                <a href="/login">

                    <LogOut
                        size={22}
                        color="rgb(68, 43, 45)"
                    />

                    Logout

                </a>

            </div>

        </aside>
    );
}