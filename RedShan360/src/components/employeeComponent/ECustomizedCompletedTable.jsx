import React, { useState } from 'react';
import { Check, Inbox, ChevronDown, ChevronUp } from 'lucide-react';
import '../../css/employee.css';
import daisyBunch from '../../assets/daisyFlowerBouquet.jpg';

// ---------------- CUSTOMIZED COMPLETED ORDERS TABLE ----------------
export default function ECustomizedCompletedTable({ orders, onItemClick }) {
  const displayOrders = orders || [];

  // ---------------- STATE ----------------
  const [expandedOrders, setExpandedOrders] = useState({});

  // ---------------- GROUP ORDERS BY ORDER ID ----------------
  const groupedOrders = React.useMemo(() => {
    const groups = {};
    displayOrders.forEach(item => {
      if (!groups[item.orderId]) {
        groups[item.orderId] = {
          orderId: item.orderId,
          items: [],
          totalQuantity: 0,
        };
      }
      groups[item.orderId].items.push(item);
      groups[item.orderId].totalQuantity += item.Quantity || 1;
    });
    return Object.values(groups);
  }, [displayOrders]);

  // ---------------- TOGGLE ORDER EXPAND / COLLAPSE ----------------
  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // ---------------- EMPTY STATE ----------------
  if (groupedOrders.length === 0) {
    return (
      <div className="employee-empty-state">
        <div className="employee-empty-icon-wrapper" style={{ color: '#0f766e', backgroundColor: '#f0fdfa' }}>
          <Check size={32} />
        </div>
        <h3 className="employee-empty-title">No completed tasks yet</h3>
        <p className="employee-empty-text">Completed works will appear here once you finish them.</p>
      </div>
    );
  }

  // ---------------- MAIN TABLE ----------------
  return (
    <div className="employee-table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Number of Items</th>
            <th>Total Quantity</th>
            <th style={{ textAlign: 'right', paddingRight: '40px' }}>Items Details</th>
          </tr>
        </thead>
        <tbody>
          {groupedOrders.map((group) => {
            const isExpanded = !!expandedOrders[group.orderId];

            return (
              <React.Fragment key={group.orderId}>

                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--color-primary, #744F51)' }}>
                    {group.orderId}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {group.items.length} {group.items.length === 1 ? 'Item' : 'Items'}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {group.totalQuantity}
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <button
                      className="expand-btn"
                      onClick={() => toggleExpand(group.orderId)}
                    >
                      {isExpanded ? (
                        <>Hide Items <ChevronUp size={16} /></>
                      ) : (
                        <>Show Items <ChevronDown size={16} /></>
                      )}
                    </button>
                  </td>
                </tr>

                {isExpanded && (
                  <tr>
                    <td colSpan={4} style={{ padding: 0, backgroundColor: 'var(--color-bg-page)' }}>
                      <div className="expanded-row-container">
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
                            {group.items.map((item) => {
                              const rowKey = `${item.orderId}-${item.ItemID}`;
                              const displayImage = item.image || item.OrderPicture || daisyBunch;

                              return (
                                <tr key={rowKey}>
                                  <td>
                                    <span
                                      className="item-id-clickable"
                                      onClick={() => onItemClick && onItemClick(item)}
                                    >
                                      {item.ItemID}
                                    </span>
                                  </td>
                                  <td>
                                    <img
                                      src={displayImage}
                                      alt={item.OrderName}
                                      className="employee-table-thumbnail"
                                      onError={(e) => {
                                        e.target.src = daisyBunch;
                                      }}
                                    />
                                  </td>
                                  <td style={{ fontWeight: '600' }}>{item.OrderName}</td>
                                  <td style={{ fontWeight: '600' }}>{item.Quantity || 1}</td>
                                  <td>
                                    <span style={{
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
                                    }}>
                                      <Check size={12} /> Completed
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
