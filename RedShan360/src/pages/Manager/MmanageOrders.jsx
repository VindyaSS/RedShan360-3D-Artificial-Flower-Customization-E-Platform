import React from "react";
import SideNavigation from '../../components/managerComponent/sideNavigation';
import MTabs from "../../components/managerComponent/mTabs";
import '../../css/manager.css';

// ---------------- MANAGE ORDERS PAGE ----------------
export default function MmanageOrders() {

    return (
        <div className="MPage">
            <div className="Mpart1">
                <SideNavigation />
            </div>
            <div className="Mpart2">
                <MTabs />
            </div>
        </div>
    );
}