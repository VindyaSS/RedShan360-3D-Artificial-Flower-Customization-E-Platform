import React, { useState } from 'react';
import {
  Check,
  Inbox,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import '../../css/employee.css';
import daisyBunch from '../../assets/daisyFlowerBouquet.jpg';

export default function ENormalCompletedTable({
  orders,
  orderItems,
  onItemClick,
  onShowItems
}) {
  const displayOrders = orders || [];

  const [expandedOrders, setExpandedOrders] = useState({});

  /*
   * ============================================
   * Expand / Collapse Order
   * ============================================
   */
  const toggleExpand = async (orderId) => {

    const currentlyExpanded =
      !!expandedOrders[orderId];

    /*
     * Collapse
     */
    if (currentlyExpanded) {

      setExpandedOrders((prev) => ({
        ...prev,
        [orderId]: false
      }));

      return;
    }

    /*
     * Expand
     *
     * If item details are not already loaded,
     * fetch them from backend.
     */
    if (
      !orderItems ||
      !Array.isArray(orderItems[orderId])
    ) {

      console.log(
        '===================================='
      );

      console.log(
        'COMPLETED TABLE - FETCHING ITEMS'
      );

      console.log(
        'ORDER ID:',
        orderId
      );

      if (onShowItems) {
        await onShowItems(orderId);
      }
    }

    /*
     * Expand after fetching.
     */
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: true
    }));
  };


  /*
   * ============================================
   * Empty State
   * ============================================
   */
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
          <strong>
            No completed tasks yet
          </strong>

          <br />

          <span>
            Completed works will appear here
            once you finish them.
          </span>
        </div>
      </div>
    );
  }


  /*
   * ============================================
   * Main Table
   * ============================================
   */
  return (
    <div className="employee-table-wrapper">

      <table className="employee-table">

        {/* ================= HEADER ================= */}

        <thead>

          <tr>

            <th>
              Order ID
            </th>

            <th>
              Number of Items
            </th>

            <th>
              Total Quantity
            </th>

            <th
              style={{
                textAlign: 'right',
                paddingRight: '40px'
              }}
            >
              Items Details
            </th>

          </tr>

        </thead>


        {/* ================= BODY ================= */}

        <tbody>

          {displayOrders.map((order) => {

            const orderId =
              order.orderId;

            const isExpanded =
              !!expandedOrders[orderId];


            /*
             * IMPORTANT:
             *
             * completedOrders contains only:
             *
             * orderId
             * numberOfItems
             * totalQuantity
             *
             * Actual item information is stored in:
             *
             * orderItems[orderId]
             */
            const items =
              orderItems &&
                Array.isArray(orderItems[orderId])
                ? orderItems[orderId]
                : [];


            console.log(
              '===================================='
            );

            console.log(
              'COMPLETED TABLE - ORDER:',
              orderId
            );

            console.log(
              'COMPLETED TABLE - ITEMS:',
              items
            );


            return (
              <React.Fragment
                key={orderId}
              >

                {/* ================= ORDER ROW ================= */}

                <tr>

                  {/* ORDER ID */}

                  <td
                    style={{
                      fontWeight: '700',
                      color:
                        'var(--color-primary, #744F51)'
                    }}
                  >
                    {orderId}
                  </td>


                  {/* NUMBER OF ITEMS */}

                  <td
                    style={{
                      fontWeight: '600'
                    }}
                  >
                    {order.numberOfItems}{' '}

                    {order.numberOfItems === 1
                      ? 'Item'
                      : 'Items'}
                  </td>


                  {/* TOTAL QUANTITY */}

                  <td
                    style={{
                      fontWeight: '600'
                    }}
                  >
                    {order.totalQuantity}
                  </td>


                  {/* SHOW / HIDE BUTTON */}

                  <td
                    style={{
                      textAlign: 'right',
                      paddingRight: '20px'
                    }}
                  >

                    <button
                      type="button"
                      className="expand-btn"
                      onClick={() =>
                        toggleExpand(orderId)
                      }
                    >

                      {isExpanded ? (
                        <>
                          Hide Items
                          <ChevronUp
                            size={16}
                          />
                        </>
                      ) : (
                        <>
                          Show Items
                          <ChevronDown
                            size={16}
                          />
                        </>
                      )}

                    </button>

                  </td>

                </tr>


                {/* ================= ITEM DETAILS ================= */}

                {isExpanded && (

                  <tr>

                    <td
                      colSpan={4}
                      style={{
                        padding: 0,
                        backgroundColor:
                          'var(--color-bg-page)'
                      }}
                    >

                      <div
                        className="expanded-row-container"
                      >

                        {/* ================= NO ITEMS ================= */}

                        {items.length === 0 ? (

                          <div
                            style={{
                              padding: '25px',
                              textAlign:
                                'center',
                              color: '#666'
                            }}
                          >
                            Loading item details...
                          </div>

                        ) : (

                          /* ================= ITEM TABLE ================= */

                          <table
                            className="employee-sub-table"
                          >

                            <thead>

                              <tr>

                                <th>
                                  Item ID
                                </th>

                                <th>
                                  Picture
                                </th>

                                <th>
                                  Item Name
                                </th>

                                <th>
                                  Quantity
                                </th>

                                <th>
                                  Status
                                </th>

                              </tr>

                            </thead>


                            <tbody>

                              {items.map((item) => {

                                const rowKey =
                                  `${orderId}-${item.itemId}`;


                                /*
                                 * Backend DTO:
                                 *
                                 * imageUrl
                                 */
                                const displayImage =
                                  item.imageUrl;


                                console.log(
                                  'COMPLETED ITEM:',
                                  {
                                    orderId:
                                      orderId,

                                    itemId:
                                      item.itemId,

                                    itemName:
                                      item.itemName,

                                    imageUrl:
                                      item.imageUrl,

                                    quantity:
                                      item.quantity,

                                    stockQuantity:
                                      item.stockQuantity,

                                    status:
                                      item.status
                                  }
                                );


                                return (

                                  <tr
                                    key={rowKey}
                                  >

                                    {/* ================= ITEM ID ================= */}

                                    <td>

                                      <span
                                        className="item-id-clickable"
                                        onClick={() => {

                                          console.log(
                                            'COMPLETED ITEM CLICKED:',
                                            item
                                          );

                                          if (
                                            onItemClick
                                          ) {
                                            onItemClick(
                                              item
                                            );
                                          }

                                        }}
                                      >
                                        {item.itemId}
                                      </span>

                                    </td>


                                    {/* ================= IMAGE ================= */}

                                    <td>
                                      <img
                                        src={
                                          item.imageUrl
                                            ? item.imageUrl.startsWith("http")
                                              ? item.imageUrl
                                              : `http://localhost:8080${item.imageUrl}`
                                            : daisyBunch
                                        }
                                        alt={item.itemName || "Item"}
                                        className="employee-table-thumbnail"
                                        onLoad={(e) => {
                                          console.log(
                                            "✅ IMAGE LOADED SUCCESSFULLY:",
                                            e.currentTarget.src
                                          );
                                        }}
                                        onError={(e) => {
                                          console.error(
                                            "❌ IMAGE FAILED TO LOAD:",
                                            e.currentTarget.src
                                          );

                                          console.error("❌ ITEM:", item);

                                          // Prevent infinite error loop
                                          e.currentTarget.onerror = null;

                                          e.currentTarget.src = daisyBunch;
                                        }}
                                      />
                                    </td>

                                    {/* ================= ITEM NAME ================= */}
                                    <td style={{ fontWeight: '600' }}>
                                      {item.itemName || 'Unknown Item'}
                                    </td>


                                    {/* ================= QUANTITY ================= */}
                                    <td style={{ fontWeight: '600' }}>
                                      {item.quantity ?? 0}
                                    </td>


                                    {/* ================= STATUS ================= */}
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