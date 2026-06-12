import React from "react";
import SideNavigation from '../../components/managerComponent/sideNavigation';
import '../../css/manager.css'
import MOrderCard from "../../components/managerComponent/MOrderCard";


export default function ManagerOverview() {
    return (
        <>

            <div className="MPage">
                <div className="Mpart1">
                    <SideNavigation />

                </div>

                <div className="Mpart2">
                    <MOrderCard
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-12 h-12 mx-auto text-[#333]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                />
                            </svg>
                        }

                        title="Total Orders"
                        value={50}
                    />
                    
                    <MOrderCard
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-12 h-12 mx-auto text-[#333]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                />
                            </svg>
                        }

                        title="Total Orders"
                        value={50}
                    />

                    <MOrderCard
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-12 h-12 mx-auto text-[#333]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                />
                            </svg>
                        }

                        title="Total Orders"
                        value={50}
                    />
                </div>

            </div>





















        </>

    );





















}