import React, { useState } from 'react';
import ESideNavigation from '../../components/employeeComponent/ESideNavigation';
import ECustomizedOrderTable from '../../components/employeeComponent/ECustomizedOrderTable';
import ECustomizedCompletedTable from '../../components/employeeComponent/ECustomizedCompletedTable';
import ECustomizedItemCard from '../../components/employeeComponent/ECusomizedItemCard';
import '../../css/employee.css';

// Fallback flower pictures
import daisyBunch from '../../assets/daisyFlowerBouquet.jpg';
import redRoseBunch from '../../assets/redRoseBouquet.jpg';
import lilyBunch from '../../assets/lilyBoquet.jpg';

const INITIAL_TASKS = [
  {
    OrderID: 'CUST-2001',
    ItemID: 'CITM-6001',
    OrderName: 'Custom Rose Bouquet',
    image: redRoseBunch,
    Quantity: 1,
    status: 'Pending',
    FlowerType: 'Red Roses & White Baby Breath',
    numberOfFlower: '24 Roses',
    BoquetStyle: 'Round Dome Style',
    DecorativeFoliage: 'Eucalyptus & Ferns',
    WrappingAndAccents: 'Black Matte Kraft Paper with Red Ribbon'
  },
  {
    OrderID: 'CUST-2001',
    ItemID: 'CITM-6002',
    OrderName: 'Custom Lily Design',
    image: lilyBunch,
    Quantity: 1,
    status: 'Pending',
    FlowerType: 'Pink Lilies',
    numberOfFlower: '10 Lilies',
    BoquetStyle: 'Classic Tall Arrangement',
    DecorativeFoliage: 'Palm Leaves & Ivy',
    WrappingAndAccents: 'Burlap Wrap with Lace Ribbon'
  },
  {
    OrderID: 'CUST-2002',
    ItemID: 'CITM-6003',
    OrderName: 'Custom Daisy Mix',
    image: daisyBunch,
    Quantity: 2,
    status: 'In Progress',
    FlowerType: 'Yellow and White Daisies',
    numberOfFlower: '30 Daisies',
    BoquetStyle: 'Casual Country Hand-tied',
    DecorativeFoliage: 'Greenery Grass',
    WrappingAndAccents: 'Brown Craft Paper with Jute Twine'
  },
  {
    OrderID: 'CUST-2003',
    ItemID: 'CITM-6004',
    OrderName: 'Custom Floral Symphony',
    image: redRoseBunch,
    Quantity: 1,
    status: 'Completed',
    FlowerType: 'Roses & Lilies Mix',
    numberOfFlower: '12 Roses & 6 Lilies',
    BoquetStyle: 'Cascade Bouquet',
    DecorativeFoliage: 'Eucalyptus & Myrtle',
    WrappingAndAccents: 'White Satin Wrap with Silver Pins'
  }
];

export default function EcustomizedProducts() {
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
              Assigned Tasks (Customized Items)
            </h3>
            <ECustomizedOrderTable
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
              Completed Tasks (Customized Items)
            </h3>
            <ECustomizedCompletedTable
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
            <ECustomizedItemCard
              ItemID={selectedItem.ItemID}
              image={selectedItem.image}
              FlowerType={selectedItem.FlowerType}
              numberOfFlower={selectedItem.numberOfFlower}
              BoquetStyle={selectedItem.BoquetStyle}
              DecorativeFoliage={selectedItem.DecorativeFoliage}
              WrappingAndAccents={selectedItem.WrappingAndAccents}
              onClose={() => setSelectedItem(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}