import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import '../../css/employee.css';

// ---------------- CUSTOMIZED COMPLETED ORDERS TABLE ----------------
export default function ECustomizedCompletedTable({ orders, onItemClick }) {

  console.log(
    '[ECustomizedCompletedTable] Props received:',
    { orders, onItemClick }
  );

  const displayOrders = Array.isArray(orders) ? orders : [];

  // ---------------- STATE ----------------
  const [expandedOrders, setExpandedOrders] = useState({});

  // ---------------- TOGGLE ORDER EXPAND / COLLAPSE ----------------
  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // ---------------- EMPTY STATE ----------------
  if (displayOrders.length === 0) {
    return (
      <div className="employee-empty-state">
        <div
          className="employee-empty-icon-wrapper"
          style={{
            color: '#0f766e',
            backgroundColor: '#f0fdfa',
          }}
        >
          <Check size={32} />
        </div>

        <h3 className="employee-empty-title">
          No completed tasks yet
        </h3>

        <p className="employee-empty-text">
          Completed works will appear here once you finish them.
        </p>
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

            <th
              style={{
                textAlign: 'right',
                paddingRight: '40px',
              }}
            >
              Items Details
            </th>
          </tr>
        </thead>

        <tbody>

          {displayOrders.map((order) => {

            const isExpanded =
              !!expandedOrders[order.orderId];

            const items =
              Array.isArray(order.items)
                ? order.items
                : [];

            return (
              <React.Fragment key={order.orderId}>

                {/* ---------------- ORDER ROW ---------------- */}
                <tr>

                  <td
                    style={{
                      fontWeight: '700',
                      color:
                        'var(--color-primary, #744F51)',
                    }}
                  >
                    {order.orderId ? `#RS-000${order.orderId}` : '-'}
                  </td>

                  <td
                    style={{
                      fontWeight: '600',
                    }}
                  >
                    {order.numberOfItems ??
                      items.length}{' '}

                    {(order.numberOfItems ??
                      items.length) === 1
                      ? 'Item'
                      : 'Items'}
                  </td>

                  <td
                    style={{
                      textAlign: 'right',
                      paddingRight: '20px',
                    }}
                  >
                    <button
                      className="expand-btn"
                      onClick={() =>
                        toggleExpand(order.orderId)
                      }
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


                {/* ---------------- EXPANDED ITEMS ---------------- */}
                {isExpanded && (

                  <tr>

                    <td
                      colSpan={3}
                      style={{
                        padding: 0,
                        backgroundColor:
                          'var(--color-bg-page)',
                      }}
                    >

                      <div className="expanded-row-container">

                        <table className="employee-sub-table">

                          <thead>
                            <tr>
                              <th>Custom ID</th>
                              <th>Item Name</th>
                              <th>Flowers & Quantities</th>
                              <th>Status</th>
                            </tr>
                          </thead>

                          <tbody>

                            {items.map((item) => {

                              const customId =
                                item.itemId;

                              const rowKey =
                                `${order.orderId}-${customId}`;

                              return (

                                <tr key={rowKey}>

                                  {/* CUSTOM ID */}
                                  <td>

                                    <span
                                      className="item-id-clickable"
                                      onClick={() =>
                                        onItemClick &&
                                        onItemClick({
                                          ...item,

                                          orderId:
                                            order.orderId,

                                          itemId:
                                            item.itemId,
                                        })
                                      }
                                    >
                                      {item.itemId}
                                    </span>

                                  </td>


                                  {/* ITEM NAME */}
                                  <td
                                    style={{
                                      fontWeight: '600',
                                    }}
                                  >
                                    {item.itemName ||
                                      'Customized Bouquet'}
                                  </td>


                                  {/* FLOWERS & QUANTITIES LINE BY LINE */}
                                  <td>
                                    {item.flowerQuantities && Object.keys(item.flowerQuantities).length > 0 ? (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {Object.entries(item.flowerQuantities).map(([flowerName, qty]) => (
                                          <span key={flowerName} style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                            <span style={{ fontWeight: '600' }}>{flowerName}</span> : {qty}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span style={{ color: '#888' }}>-</span>
                                    )}
                                  </td>


                                  {/* STATUS */}
                                  <td>

                                    <span
                                      style={{
                                        color: '#0f766e',
                                        fontWeight: '700',
                                        fontSize: '12.5px',
                                        display:
                                          'inline-flex',
                                        alignItems:
                                          'center',
                                        gap: '4px',
                                        backgroundColor:
                                          '#f0fdfa',
                                        padding:
                                          '4px 10px',
                                        borderRadius:
                                          '20px',
                                        border:
                                          '1px solid #ccfbf1',
                                      }}
                                    >
                                      <Check size={12} />

                                      {item.status ===
                                      'COMPLETED'
                                        ? 'Completed'
                                        : item.status}
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