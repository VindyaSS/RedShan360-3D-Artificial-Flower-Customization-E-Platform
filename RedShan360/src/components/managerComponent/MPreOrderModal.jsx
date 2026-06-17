import React, { useState } from "react";
import { X, User, ShoppingBag, DollarSign, Calendar, Heart, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import "../../css/manager.css";

export default function MPreOrderModal({
    isOpen,
    onClose,
    order,          // Single order for detail mode
    onApprove,      // Action for detail mode
    employeeName,   // Selected employee for assignment mode
    preOrders = [], // List of pre-orders for assignment mode
    onAssign        // Callback when assigning an order to an employee
}) {
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    if (!isOpen) return null;

    const isAssignmentMode = !!employeeName;

    const toggleExpandOrder = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>

                {/* Modal Header */}
                <div className="modal-header">
                    <div className="modal-title-area">
                        <span className="modal-badge">{isAssignmentMode ? "Assignment" : "Pre-Order"}</span>
                        <h3>
                            {isAssignmentMode
                                ? `Assign Order to ${employeeName}`
                                : `Order Details: ${order?.OrderID}`}
                        </h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {isAssignmentMode ? (
                        // --- Assignment Mode ---
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <p style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: 0 }}>
                                Select a preorder from the list below to assign to <strong>{employeeName}</strong>.
                                Click on customize order row to preview its 3D customization specifications.
                            </p>

                            {preOrders.length === 0 ? (
                                <div style={{
                                    textAlign: "center",
                                    padding: "40px 20px",
                                    background: "var(--color-bg-page)",
                                    border: "1px dashed var(--color-border)",
                                    borderRadius: "12px",
                                    color: "var(--color-text-muted)"
                                }}>
                                    <ShoppingBag size={32} style={{ marginBottom: "8px", color: "var(--color-primary)", opacity: 0.6 }} />
                                    <p style={{ fontWeight: "600", fontSize: "14px", margin: 0 }}>No pre-orders available</p>
                                    <p style={{ fontSize: "12px", margin: "4px 0 0 0" }}>All current pre-orders have been assigned to employees.</p>
                                </div>
                            ) : (
                                <div className="assignment-table-wrapper" style={{ overflowX: "auto", border: "1px solid var(--color-border)", borderRadius: "8px" }}>
                                    <table className="modal-table" style={{ border: "none", boxShadow: "none" }}>
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Order Name</th>
                                                <th>Price</th>
                                                <th>Type</th>
                                                <th style={{ textAlign: "right" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preOrders.map((po) => {
                                                const isCustom = !po.Type || po.Type.toLowerCase() === "customize order";
                                                const isExpanded = expandedOrderId === po.OrderID;
                                                return (
                                                    <React.Fragment key={po.OrderID}>
                                                        {/* Main row */}
                                                        <tr
                                                            onClick={() => isCustom && toggleExpandOrder(po.OrderID)}
                                                            style={{ cursor: isCustom ? "pointer" : "default" }}
                                                            title={isCustom ? "Click to view customization specs" : undefined}
                                                        >
                                                            <td>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}>
                                                                    {isCustom && (isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                                                                    {po.OrderID}
                                                                </div>
                                                            </td>
                                                            <td>{po.CustomerName}</td>
                                                            <td>{po.OrderName}</td>
                                                            <td style={{ fontWeight: "600", color: "var(--color-primary)" }}>{po.Price}</td>
                                                            <td>
                                                                <span className="modal-badge" style={{
                                                                    background: isCustom ? "rgba(116, 79, 81, 0.1)" : "rgba(102, 102, 102, 0.1)",
                                                                    color: isCustom ? "var(--color-primary)" : "var(--color-text-muted)",
                                                                    textTransform: "none",
                                                                    fontSize: "12px",
                                                                    fontWeight: "600"
                                                                }}>
                                                                    {po.Type || "customize order"}
                                                                </span>
                                                            </td>
                                                            <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                                                                <button
                                                                    className="btn-dispatch"
                                                                    style={{ padding: "6px 12px", fontSize: "12px" }}
                                                                    onClick={() => {
                                                                        if (onAssign) onAssign(employeeName, po);
                                                                        onClose();
                                                                    }}
                                                                >
                                                                    Assign
                                                                </button>
                                                            </td>
                                                        </tr>

                                                        {/* Expanded Customization Details Row */}
                                                        {isExpanded && isCustom && (
                                                            <tr style={{ background: "rgba(116, 79, 81, 0.02)" }}>
                                                                <td colSpan="6" style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)" }}>
                                                                    <div className="modal-grid" style={{ margin: 0 }}>
                                                                        <div className="modal-card-info" style={{ padding: "12px", gap: "8px" }}>
                                                                            <div className="card-header" style={{ paddingBottom: "6px" }}>
                                                                                <User size={14} className="card-icon" />
                                                                                <h4 style={{ fontSize: "12px" }}>Customer Details</h4>
                                                                            </div>
                                                                            <div className="card-content" style={{ gap: "4px" }}>
                                                                                <div className="info-row" style={{ fontSize: "12px" }}>
                                                                                    <span className="info-label">Contact:</span>
                                                                                    <span className="info-val">{po.Contact || "N/A"}</span>
                                                                                </div>
                                                                                <div className="info-row" style={{ fontSize: "12px" }}>
                                                                                    <span className="info-label">Delivery:</span>
                                                                                    <span className="info-val">{po.ShippingMethod || "Standard Shipping"}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="modal-card-info" style={{ padding: "12px", gap: "8px" }}>
                                                                            <div className="card-header" style={{ paddingBottom: "6px" }}>
                                                                                <Sparkles size={14} className="card-icon" />
                                                                                <h4 style={{ fontSize: "12px" }}>Customization Specs</h4>
                                                                            </div>
                                                                            <div className="card-content" style={{ gap: "4px" }}>
                                                                                <div className="info-row" style={{ fontSize: "12px" }}>
                                                                                    <span className="info-label">Flower:</span>
                                                                                    <span className="info-val">{po.FlowerType || "Rose/Lily Hybrid"}</span>
                                                                                </div>
                                                                                <div className="info-row" style={{ fontSize: "12px" }}>
                                                                                    <span className="info-label">Theme:</span>
                                                                                    <span className="info-val">
                                                                                        <span className="color-indicator-swatch" style={{ backgroundColor: po.ColorHex || "#E2B6B6", width: "10px", height: "10px" }}></span>
                                                                                        {po.ColorTheme || "Dusty Pink & White"}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="info-row" style={{ fontSize: "12px" }}>
                                                                                    <span className="info-label">Paper:</span>
                                                                                    <span className="info-val">{po.WrappingPaper || "Craft Matte"}</span>
                                                                                </div>
                                                                                <div className="info-row" style={{ fontSize: "12px" }}>
                                                                                    <span className="info-label">Card Message:</span>
                                                                                    <span className="info-val card-message" style={{ fontSize: "11px", maxWidth: "150px" }}>"{po.CardMessage || "Greetings!"}"</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        // --- Single Order Detail Mode ---
                        order && (
                            <>
                                <div className="modal-grid">
                                    {/* Customer Info Card */}
                                    <div className="modal-card-info">
                                        <div className="card-header">
                                            <User size={18} className="card-icon" />
                                            <h4>Customer Information</h4>
                                        </div>
                                        <div className="card-content">
                                            <div className="info-row">
                                                <span className="info-label">Name:</span>
                                                <span className="info-val">{order.CustomerName}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Contact:</span>
                                                <span className="info-val">{order.Contact || "N/A"}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Date Placed:</span>
                                                <span className="info-val">{order.OrderDate || "Recent"}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Shipping Method:</span>
                                                <span className="info-val">{order.ShippingMethod || "Standard Delivery"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customization Details Card */}
                                    <div className="modal-card-info">
                                        <div className="card-header">
                                            <Sparkles size={18} className="card-icon" />
                                            <h4>Flower Customization Specifications</h4>
                                        </div>
                                        <div className="card-content">
                                            <div className="info-row">
                                                <span className="info-label">Design Preset:</span>
                                                <span className="info-val highlight-val">{order.OrderName}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Primary Flower:</span>
                                                <span className="info-val">{order.FlowerType || "Rose/Lily Hybrid"}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Color Theme:</span>
                                                <span className="info-val">
                                                    <span className="color-indicator-swatch" style={{ backgroundColor: order.ColorHex || "#E2B6B6" }}></span>
                                                    {order.ColorTheme || "Dusty Pink & White"}
                                                </span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Wrapping paper:</span>
                                                <span className="info-val">{order.WrappingPaper || "Premium Craft Matte"}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Ribbon / Accent:</span>
                                                <span className="info-val">{order.RibbonAccent || "Satin Gold"}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Card Message:</span>
                                                <span className="info-val card-message">"{order.CardMessage || "Happy Custom Bouquet Celebration!"}"</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cost & Summary Banner */}
                                <div className="modal-summary-banner">
                                    <div className="banner-item">
                                        <DollarSign size={20} className="banner-icon" />
                                        <div>
                                            <span className="banner-label">Total Amount</span>
                                            <span className="banner-val">{order.Price}</span>
                                        </div>
                                    </div>
                                    <div className="banner-item">
                                        <ShieldAlert size={20} className="banner-icon" />
                                        <div>
                                            <span className="banner-label">Customization Status</span>
                                            <span className="banner-val status-badge">Ready for Assignment</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        Close Window
                    </button>
                    {!isAssignmentMode && order && (
                        <button className="btn-approve-action" onClick={() => {
                            if (onApprove) onApprove(order.OrderID);
                            onClose();
                        }}>
                            Approve & Move to Processing
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
