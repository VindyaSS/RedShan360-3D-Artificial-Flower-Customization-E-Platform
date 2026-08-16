import React, { useState } from 'react';
import {
  Check,
  Inbox,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import '../../css/employee.css';
import daisyBunch from '../../assets/daisyFlowerBouquet.jpg';

// ---------------- NORMAL COMPLETED ORDERS TABLE ----------------
export default function ENormalCompletedTable({
  orders,
  orderItems,
  onItemClick,
  onShowItems
}) {
  const displayOrders = orders || [];

  // ---------------- STATE ----------------
  const [expandedOrders, setExpandedOrders] = useState({});

  // ---------------- TOGGLE ORDER EXPAND / COLLAPSE ----------------
  const toggleExpand = async (orderId) => {

    const currentlyExpanded = !!expandedOrders[orderId];

    // Collapse if already expanded
    if (currentlyExpanded) {
      setExpandedOrders((prev) => ({
        ...prev,
        [orderId]: false
      }));
      return;
    }

    // Fetch item details from backend if not yet loaded
    if (!orderItems || !Array.isArray(orderItems[orderId])) {
      if (onShowItems) {
        await onShowItems(orderId);
      }
    }

    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: true
    }));
  };

  // ---------------- EMPTY STATE ----------------
  if (displayOrders.length === 0) {
    return (
      <div
        className="employee-empty-icon-wrapper"
        style={{
          color: '#0f766e',
          backgroundColor: '#f0fdfa',
          padding: '30px',
          textAlign: 'center'
        }}
      >
        <div>
          <strong>No completed tasks yet</strong>
          <br />
          <span>Completed works will appear here once you finish them.</span>
        </div>
      </div>
    );
  }

  // ---------------- MAIN TABLE ----------------
  return (
    <div className="employee-table-wrapper">
      <table className="employee-table">

        <thead>
          <tr>
            <th>Order ID</th>
            <th>Number of Items</th>
            <th>Total Quantity</th>
            <th style={{ textAlign: 'right', paddingRight: '40px' }}>
              Items Details
            </th>
          </tr>
        </thead>

        <tbody>
          {displayOrders.map((order) => {

            const orderId = order.orderId;
            const isExpanded = !!expandedOrders[orderId];

            // Item details are stored separately in orderItems[orderId]
            const items =
              orderItems && Array.isArray(orderItems[orderId])
                ? orderItems[orderId]
                : [];

            return (
              <React.Fragment key={orderId}>

                <tr>

                  <td style={{ fontWeight: '700', color: 'var(--color-primary, #744F51)' }}>
                    {orderId}
                  </td>

                  <td style={{ fontWeight: '600' }}>
                    {order.numberOfItems}{' '}
                    {order.numberOfItems === 1 ? 'Item' : 'Items'}
                  </td>

                  <td style={{ fontWeight: '600' }}>
                    {order.totalQuantity}
                  </td>

                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <button
                      type="button"
                      className="expand-btn"
                      onClick={() => toggleExpand(orderId)}
                    >
                      {isExpanded ? (
                        <>
                          Hide Items
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          Show Items
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </td>

                </tr>

                {isExpanded && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ padding: 0, backgroundColor: 'var(--color-bg-page)' }}
                    >
                      <div className="expanded-row-container">

                        {items.length === 0 ? (
                          <div style={{ padding: '25px', textAlign: 'center', color: '#666' }}>
                            Loading item details...
                          </div>
                        ) : (
                          <table className="employee-sub-table">
                            <thead>
                              <tr>
                                <th>Item ID</th>
                                <th>Picture</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Status</th>
                              </tr>
                            </thead>

                            <tbody>
                              {items.map((item) => {

                                const rowKey = `${orderId}-${item.itemId}`;

                                // Resolve full image URL — backend may return relative paths
                                const displayImage = item.imageUrl
                                  ? item.imageUrl.startsWith("http")
                                    ? item.imageUrl
                                    : `http://localhost:8080${item.imageUrl}`
                                  : daisyBunch;

                                return (
                                  <tr key={rowKey}>

                                    <td>
                                      <span
                                        className="item-id-clickable"
                                        onClick={() => {
                                          if (onItemClick) {
                                            onItemClick(item);
                                          }
                                        }}
                                      >
                                        {item.itemId}
                                      </span>
                                    </td>

                                    <td>
                                      <img
                                        src={displayImage}
                                        alt={item.itemName || "Item"}
                                        className="employee-table-thumbnail"
                                        onError={(e) => {
                                          // Prevent infinite error loop and fall back to default image
                                          e.currentTarget.onerror = null;
                                          e.currentTarget.src = daisyBunch;
                                        }}
                                      />
                                    </td>

                                    <td style={{ fontWeight: '600' }}>
                                      {item.itemName || 'Unknown Item'}
                                    </td>

                                    <td style={{ fontWeight: '600' }}>
                                      {item.quantity ?? 0}
                                    </td>

                                    <td>
                                      {item.status === 'READY_TO_PACKING' ||
                                        item.status === 'Ready to Packing' ? (
                                        <span
                                          style={{
                                            color: '#3730a3',
                                            fontWeight: '700',
                                            fontSize: '12.5px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            backgroundColor: '#e0e7ff',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            border: '1px solid #c7d2fe'
                                          }}
                                        >
                                          <Inbox size={12} />
                                          Ready to Packing
                                        </span>
                                      ) : (
                                        <span
                                          style={{
                                            color: '#0f766e',
                                            fontWeight: '700',
                                            fontSize: '12.5px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            backgroundColor: '#f0fdfa',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            border: '1px solid #ccfbf1'
                                          }}
                                        >
                                          <Check size={12} />
                                          Completed
                                        </span>
                                      )}
                                    </td>

                                  </tr>
                                );
                              })}
                            </tbody>

                          </table>
                        )}

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
  );
}