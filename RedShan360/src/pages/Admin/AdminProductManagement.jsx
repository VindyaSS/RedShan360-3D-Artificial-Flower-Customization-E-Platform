import { useState } from "react";
import { List, LayoutGrid, Plus, Pencil, Trash2, Package, Shapes, Wallet } from "lucide-react";
import AdminSidebar from "../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../components/adminComponent/AdminTopbar";
import "./AdminProductManagement.css";

// Import generated premium assets
import roseImg from "../../assets/midnight_blush_silk_rose.png";
import orchidImg from "../../assets/arctic_cascade_orchid.png";
import peonyImg from "../../assets/crimson_velvet_peony.png";

function AdminProductManagement() {
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [activeTab, setActiveTab] = useState("products"); // "products", "categories", "discounts"

  const productsData = [
    {
      id: 1,
      image: roseImg,
      name: "Midnight Blush Silk Rose",
      category: "Premium Roses",
      price: "Rs. 42.00",
      stock: 124,
      status: "IN STOCK",
    },
    {
      id: 2,
      image: orchidImg,
      name: "Arctic Cascade Orchid",
      category: "Exotic Orchids",
      price: "Rs. 78.00",
      stock: 42,
      status: "LOW STOCK",
    },
    {
      id: 3,
      image: peonyImg,
      name: "Crimson Velvet Peony",
      category: "Peonies",
      price: "Rs. 35.50",
      stock: 0,
      status: "OUT OF STOCK",
    },
  ];

  return (
    <div className="admin-dashboard-page">
      <AdminSidebar />
      <div className="admin-content">
        <AdminTopbar searchPlaceholder="Search premium catalog..." />

        {/* Header Block */}
        <div className="product-mgmt-header">
          <div className="header-text">
            <h1>Product Management</h1>
            <p>Curate and manage your collection of premium artificial florals.</p>
          </div>

          <div className="header-actions">
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List View"
              >
                <List size={16} />
              </button>
              <button
                className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Add Product Button */}
            <button className="add-product-btn">
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="product-tabs">
          <button
            className={`tab-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            PRODUCTS
          </button>
          <button
            className={`tab-item ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            CATEGORIES
          </button>
          <button
            className={`tab-item ${activeTab === "discounts" ? "active" : ""}`}
            onClick={() => setActiveTab("discounts")}
          >
            DISCOUNTS
          </button>
        </div>

        {/* Main Content Area */}
        <div className="product-mgmt-content">
          {activeTab === "products" && (
            <>
              {viewMode === "list" ? (
                /* Table View */
                <div className="table-responsive-wrapper">
                  <table className="products-table-custom">
                    <thead>
                      <tr>
                        <th>IMAGE</th>
                        <th>NAME</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>STATUS</th>
                        <th className="actions-header">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsData.map((prod) => (
                        <tr key={prod.id}>
                          <td className="image-cell">
                            <img src={prod.image} alt={prod.name} className="product-thumb" />
                          </td>
                          <td className="name-cell">
                            <strong>{prod.name}</strong>
                          </td>
                          <td className="category-cell">{prod.category}</td>
                          <td className="price-cell">{prod.price}</td>
                          <td className="stock-cell">{prod.stock} units</td>
                          <td className="status-cell">
                            <span className={`status-pill ${prod.status.toLowerCase().replace(/ /g, "-")}`}>
                              {prod.status}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button className="action-icon-btn edit-btn" aria-label="Edit product">
                              <Pencil size={15} />
                            </button>
                            <button className="action-icon-btn delete-btn" aria-label="Delete product">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Grid View */
                <div className="products-grid-custom">
                  {productsData.map((prod) => (
                    <div className="product-grid-card" key={prod.id}>
                      <div className="card-image-wrapper">
                        <img src={prod.image} alt={prod.name} className="card-thumb" />
                        <span className={`status-pill-absolute ${prod.status.toLowerCase().replace(/ /g, "-")}`}>
                          {prod.status}
                        </span>
                      </div>
                      <div className="card-details">
                        <h4>{prod.name}</h4>
                        <p className="card-category">{prod.category}</p>
                        <div className="card-footer">
                          <span className="card-price">{prod.price}</span>
                          <span className="card-stock">{prod.stock} left</span>
                        </div>
                        <div className="card-actions">
                          <button className="card-action-btn edit" aria-label="Edit">
                            <Pencil size={14} /> Edit
                          </button>
                          <button className="card-action-btn delete" aria-label="Delete">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "categories" && (
            <div className="placeholder-tab-content">
              <h3>Categories Management</h3>
              <p>Manage floral categories, tags, and custom collections.</p>
            </div>
          )}

          {activeTab === "discounts" && (
            <div className="placeholder-tab-content">
              <h3>Discounts & Promotions</h3>
              <p>Create and configure luxury catalog promo codes, campaigns, and seasonal offers.</p>
            </div>
          )}
        </div>

        {/* Bottom KPI Cards */}
        <div className="product-kpi-row">
          {/* Card 1: TOTAL SKU */}
          <div className="kpi-card-custom sku-card">
            <div className="kpi-info-block">
              <h5>TOTAL SKU</h5>
              <h3>1,248</h3>
            </div>
            <div className="kpi-icon-block">
              <Package size={24} strokeWidth={1.8} />
            </div>
          </div>

          {/* Card 2: ACTIVE CATEGORIES */}
          <div className="kpi-card-custom categories-card">
            <div className="kpi-info-block">
              <h5>ACTIVE CATEGORIES</h5>
              <h3>12</h3>
            </div>
            <div className="kpi-icon-block">
              <Shapes size={24} strokeWidth={1.8} />
            </div>
          </div>

          {/* Card 3: INVENTORY VALUE */}
          <div className="kpi-card-custom value-card">
            <div className="kpi-info-block">
              <h5>INVENTORY VALUE</h5>
              <h3>Rs. 52.4k</h3>
            </div>
            <div className="kpi-icon-block">
              <Wallet size={24} strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductManagement;
