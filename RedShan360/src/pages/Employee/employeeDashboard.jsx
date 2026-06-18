import React, { useState } from 'react';
import ESideNavigation from '../../components/employeeComponent/ESideNavigation';
import ENormalOrderTable from '../../components/employeeComponent/ENormalOrderTable';
import ENormalCompletedTable from '../../components/employeeComponent/ENormalCompletedTable';
import ENormalItemCard from '../../components/employeeComponent/ENormalItemCard';
import '../../css/employee.css';

// Fallback flower pictures
import daisyBunch from '../../assets/daisyFlowerBouquet.jpg';
import redRoseBunch from '../../assets/redRoseBouquet.jpg';
import lilyBunch from '../../assets/lilyBoquet.jpg';

const INITIAL_TASKS = [
  {
    OrderID: 'ORD-1002',
    ItemID: 'ITM-5001',
    OrderName: 'Vibrant Daisy Bunch',
    image: daisyBunch,
    Quantity: 2,
    status: 'Pending',
    numberOfFlower: '24 Daisies',
    wrappinPaper: 'Pastal Pink Kraft Wrap',
    ribbonType: 'White Satin Ribbon',
    extraAddOn: 'Use red pearls for stigma'
  },
  {
    OrderID: 'ORD-1002',
    ItemID: 'ITM-5003',
    OrderName: 'Elegant Lily Arrangement',
    image: lilyBunch,
    Quantity: 1,
    status: 'Pending',
    numberOfFlower: '3 Lilies & 3 buds',
    wrappinPaper: 'Pink Cellophane',
    ribbonType: 'White Silk Ribbon',
    extraAddOn: 'Add leaves for each flower'
  },
  {
    OrderID: 'ORD-1003',
    ItemID: 'ITM-5002',
    OrderName: 'Romantic Red Rose Bouquet',
    image: redRoseBunch,
    Quantity: 1,
    status: 'In Progress',
    numberOfFlower: '24 Red Roses',
    wrappinPaper: 'Black Luxury Paper',
    ribbonType: 'Red Satin Ribbon',
    extraAddOn: 'Nothing'
  },
  {
    OrderID: 'ORD-1004',
    ItemID: 'ITM-5003',
    OrderName: 'Elegant Lily Arrangement',
    image: lilyBunch,
    Quantity: 1,
    status: 'Pending',
    numberOfFlower: '3 Lilies & 3 buds',
    wrappinPaper: 'Pink Cellophane',
    ribbonType: 'White Silk Ribbon',
    extraAddOn: 'Add leaves for each flower'
  },
  {
    OrderID: 'ORD-1004',
    ItemID: 'ITM-5001',
    OrderName: 'Vibrant Daisy Bunch',
    image: daisyBunch,
    Quantity: 2,
    status: 'Pending',
    numberOfFlower: '12 Daisies',
    wrappinPaper: 'Pastal Pink Kraft Wrap',
    ribbonType: 'White Satin Ribbon',
    extraAddOn: 'Use red pearls for stigma'
  },
  {
    OrderID: 'ORD-1004',
    ItemID: 'ITM-5002',
    OrderName: 'Romantic Red Rose Bouquet',
    image: redRoseBunch,
    Quantity: 1,
    status: 'In Progress',
    numberOfFlower: '24 Red Roses',
    wrappinPaper: 'Black Luxury Paper',
    ribbonType: 'Red Satin Ribbon',
    extraAddOn: 'Nothing'
  }
];

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleStart = (orderId, itemId) => {
    setTasks(prev => prev.map(t => {
      if (t.OrderID === orderId && t.ItemID === itemId) {
        return { ...t, status: 'In Progress' };
      }
      return t;
    }));
  };

  const handleStop = (orderId, itemId) => {
    setTasks(prev => prev.map(t => {
      if (t.OrderID === orderId && t.ItemID === itemId) {
        return { ...t, status: 'Stopped' };
      }
      return t;
    }));
  };

  const handleComplete = (orderId, itemId) => {
    setTasks(prev => prev.map(t => {
      if (t.OrderID === orderId && t.ItemID === itemId) {
        return { ...t, status: 'Completed' };
      }
      return t;
    }));
  };

  const assignedTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="EPage">
      <div className="Epart1">
        <ESideNavigation />
      </div>
      <div className="Epart2">
        <div className="dashboard-row">
          <div className="tabs-container" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "18px",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "16px"
            }}>
              Assigned Tasks
            </h3>
            <ENormalOrderTable
              orders={assignedTasks}
              onStart={handleStart}
              onStop={handleStop}
              onComplete={handleComplete}
              onItemClick={setSelectedItem}
            />
          </div>
        </div>

        <div className="dashboard-row" style={{ marginTop: '24px' }}>
          <div className="tabs-container" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "18px",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "16px"
            }}>
              Completed Tasks
            </h3>
            <ENormalCompletedTable
              orders={completedTasks}
              onItemClick={setSelectedItem}
            />
          </div>
        </div>
      </div>

      {/* Item Details Popup Overlay */}
      {selectedItem && (
        <div className="item-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ENormalItemCard
              ItemID={selectedItem.ItemID}
              image={selectedItem.image}
              numberOfFlower={selectedItem.numberOfFlower}
              wrappinPaper={selectedItem.wrappinPaper}
              ribbonType={selectedItem.ribbonType}
              extraAddOn={selectedItem.extraAddOn}
              onClose={() => setSelectedItem(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
