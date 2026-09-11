import { useState, useEffect } from "react";
import { List, LayoutGrid, Plus, Pencil, Trash2, Package, Shapes, Wallet, X, RefreshCw, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import AdminSidebar from "../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../components/adminComponent/AdminTopbar";
import MAddNewProductForm from "../../components/managerComponent/MAddNewProductForm";
import api from "../../services/api";
import "./AdminProductManagement.css";

// Import generated premium fallback assets
import roseImg from "../../assets/midnight_blush_silk_rose.png";
import orchidImg from "../../assets/arctic_cascade_orchid.png";
import peonyImg from "../../assets/crimson_velvet_peony.png";

function AdminProductManagement() {
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [activeTab, setActiveTab] = useState("products"); // "products", "categories", "discounts"
  const [categoryFilter, setCategoryFilter] = useState("All"); // "All", "Bouquets", "Head Dresses", "Individual Flowers"
  const [searchQuery, setSearchQuery] = useState("");
  
  // Products & Loading State
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle state for Add Product Form
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ price: "", stockQuantity: "", imageFile: null, imagePreview: null });
  const [updating, setUpdating] = useState(false);

  // Success toast notification
  const [successNotification, setSuccessNotification] = useState(null);

  // Fetch products from backend API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/products");
      console.log("Fetched products for Admin Product Management:", response.data);
      const rawData = response.data || [];
      const normalized = rawData.map((p) => ({
        ...p,
        id: p.id || p.productId,
      }));
      setProductsList(normalized);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-clear notification after 4 seconds
  useEffect(() => {
    if (successNotification) {
      const timer = setTimeout(() => {
        setSuccessNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successNotification]);

  // Helper for image resolution
  const getProductImage = (product) => {
    if (product?.imageUrl) {
      if (product.imageUrl.startsWith("http")) return product.imageUrl;
      if (product.imageUrl.startsWith("/")) return `http://localhost:8080${product.imageUrl}`;
      return `http://localhost:8080/${product.imageUrl}`;
    }
    const prodId = product?.id || product?.productId;
    if (prodId === 1) return roseImg;
    if (prodId === 2) return orchidImg;
    if (prodId === 3) return peonyImg;
    return '/images/placeholder.png';
  };

  // Helper for category name mapping
  const getCategoryName = (p) => {
    if (p.categoryName) return p.categoryName;
    if (p.category?.categoryName) return p.category.categoryName;
    if (p.category?.name) return p.category.name;
    if (p.categoryId === 1) return "Bouquets";
    if (p.categoryId === 2) return "Head Dresses";
    if (p.categoryId === 3) return "Individual Flowers";
    return "General Floral";
  };

  // Helper for stock status calculation
  const getStockStatus = (stock) => {
    const qty = Number(stock) || 0;
    if (qty <= 0) return { label: "OUT OF STOCK", key: "out-of-stock" };
    if (qty <= 10) return { label: "LOW STOCK", key: "low-stock" };
    return { label: "IN STOCK", key: "in-stock" };
  };

  // Filter products by category and search query
  const filteredProducts = productsList.filter((prod) => {
    const categoryName = getCategoryName(prod);
    const matchesCategory =
      categoryFilter === "All" ||
      (categoryFilter === "Bouquets" && (prod.categoryId === 1 || categoryName.toLowerCase().includes("bouquet"))) ||
      (categoryFilter === "Head Dresses" && (prod.categoryId === 2 || categoryName.toLowerCase().includes("head"))) ||
      (categoryFilter === "Individual Flowers" && (prod.categoryId === 3 || categoryName.toLowerCase().includes("individual") || categoryName.toLowerCase().includes("flower")));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (prod.productName || "").toLowerCase().includes(query) ||
      categoryName.toLowerCase().includes(query) ||
      (prod.description || "").toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Calculate dynamic KPIs
  const totalSku = productsList.length;
  const activeCategoriesCount = new Set(productsList.map((p) => getCategoryName(p))).size || 3;
  const totalInventoryValue = productsList.reduce((acc, p) => {
    const price = Number(p.price) || 0;
    const qty = Number(p.stockQuantity) || 0;
    return acc + price * qty;
  }, 0);

  const formattedInventoryValue = `Rs. ${totalInventoryValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // Handle Delete Product
  const handleDelete = async (rawId, name) => {
    const id = rawId || editingProduct?.productId;
    if (!id) {
      alert("Invalid Product ID");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/api/products/${id}`);
        setProductsList((prev) => prev.filter((p) => (p.id || p.productId) !== id));
        setSuccessNotification(`Product "${name}" deleted successfully.`);
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product from backend.");
      }
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (prod) => {
    const initialImage = getProductImage(prod);
    const normalizedProd = {
      ...prod,
      id: prod.id || prod.productId
    };
    setEditingProduct(normalizedProd);
    setEditForm({
      price: prod.price !== undefined && prod.price !== null ? prod.price : "",
      stockQuantity: prod.stockQuantity !== undefined && prod.stockQuantity !== null ? prod.stockQuantity : "",
      imageFile: null,
      imagePreview: initialImage
    });
  };

  // Handle Image Selection inside Edit Modal
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, and WEBP image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum image file size allowed is 5MB.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setEditForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: preview
    }));
  };

  // Save Product Edits (Picture, Price, Stock Quantity)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const targetId = editingProduct.id || editingProduct.productId;
    if (!targetId) {
      alert("Product ID is missing.");
      return;
    }

    setUpdating(true);

    try {
      const newPrice = parseFloat(editForm.price) || 0;
      const newStock = parseInt(editForm.stockQuantity, 10) || 0;

      let updatedImageUrl = editingProduct.imageUrl;

      if (editForm.imageFile) {
        // Upload new image along with price & stock to multipart endpoint
        const formData = new FormData();
        formData.append("price", newPrice);
        formData.append("stockQuantity", newStock);
        formData.append("image", editForm.imageFile);

        const response = await api.post(`/api/products/${targetId}/update`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (response.data && response.data.imageUrl) {
          updatedImageUrl = response.data.imageUrl;
        }
      } else {
        // Update price & stock quantity directly via multipart update or fallback endpoints
        try {
          const formData = new FormData();
          formData.append("price", newPrice);
          formData.append("stockQuantity", newStock);
          const response = await api.post(`/api/products/${targetId}/update`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          if (response.data && response.data.imageUrl) {
            updatedImageUrl = response.data.imageUrl;
          }
        } catch (postErr) {
          console.warn("Multipart update endpoint fallback, trying price & quantity endpoints:", postErr);
          await api.put(`/api/products/${targetId}/price`, { price: newPrice });
          await api.put(`/api/products/${targetId}/quantity`, { quantity: newStock });
        }
      }

      // Update UI state dynamically
      setProductsList((prev) =>
        prev.map((p) => {
          const currentId = p.id || p.productId;
          return currentId === targetId
            ? {
                ...p,
                price: newPrice,
                stockQuantity: newStock,
                imageUrl: updatedImageUrl || p.imageUrl
              }
            : p;
        })
      );

      setSuccessNotification(`Updated picture, price (Rs. ${newPrice.toFixed(2)}), and stock (${newStock} units) for "${editingProduct.productName}" in database!`);
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product details in database: " + (error.response?.data?.message || error.message || error));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <AdminSidebar />
      <div className="admin-content">
        <AdminTopbar
          searchPlaceholder="Search catalog by name, category..."
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Success Toast Notification */}
        {successNotification && (
          <div className="admin-toast-container">
            <div className="admin-toast-icon">
              <CheckCircle2 size={16} />
            </div>
            <div className="admin-toast-text">
              <span className="admin-toast-title">Success!</span>
              <span className="admin-toast-desc">{successNotification}</span>
            </div>
            <button
              onClick={() => setSuccessNotification(null)}
              className="admin-toast-close"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="admin-edit-modal-overlay">
            <div className="admin-edit-modal">
              <div className="modal-header-custom">
                <h3>Edit Product</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setEditingProduct(null)}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSaveEdit}>
                <div className="modal-body-custom">
                  {/* Product Picture Upload & Preview */}
                  <div className="form-group-custom">
                    <label>Product Picture</label>
                    <div className="image-upload-wrapper">
                      <img
                        src={editForm.imagePreview || getProductImage(editingProduct)}
                        alt={editingProduct.productName}
                        className="edit-image-preview"
                      />
                      <div>
                        <label htmlFor="edit-image-input" className="upload-btn-label">
                          <Upload size={15} />
                          <span>{editForm.imageFile ? "Change Selected Image" : "Upload New Picture"}</span>
                        </label>
                        <input
                          id="edit-image-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                        {editForm.imageFile && (
                          <p style={{ fontSize: "11px", color: "#2e7d32", marginTop: "4px", fontWeight: "600" }}>
                            ✓ Selected: {editForm.imageFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-product-summary">
                    <div className="modal-product-info">
                      <h4>{editingProduct.productName}</h4>
                      <p>{getCategoryName(editingProduct)}</p>
                    </div>
                  </div>

                  <div className="form-group-custom">
                    <label>Price (Rs)</label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">Rs.</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="form-input-custom"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-custom">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.stockQuantity}
                      onChange={(e) => setEditForm({ ...editForm, stockQuantity: e.target.value })}
                      className="form-input-custom"
                      required
                    />
                  </div>

                  <div className="modal-actions-custom">
                    <button
                      type="button"
                      className="btn-cancel-custom"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-save-custom"
                      disabled={updating}
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

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
            <button
              className="add-product-btn"
              onClick={() => setIsAddingProduct(!isAddingProduct)}
            >
              {isAddingProduct ? <X size={18} /> : <Plus size={18} />}
              <span>{isAddingProduct ? "Close Form" : "Add Product"}</span>
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
          {isAddingProduct ? (
            <MAddNewProductForm
              onClose={() => setIsAddingProduct(false)}
              onSubmit={() => {
                setIsAddingProduct(false);
                fetchProducts();
                setSuccessNotification("New product added successfully!");
              }}
            />
          ) : activeTab === "products" ? (
            <>
              {/* Category Sector Pills Filter */}
              <div className="category-filter-pills">
                {["All", "Bouquets", "Head Dresses", "Individual Flowers"].map((cat) => {
                  const count =
                    cat === "All"
                      ? productsList.length
                      : productsList.filter((p) => {
                          const cName = getCategoryName(p);
                          if (cat === "Bouquets") return p.categoryId === 1 || cName.toLowerCase().includes("bouquet");
                          if (cat === "Head Dresses") return p.categoryId === 2 || cName.toLowerCase().includes("head");
                          if (cat === "Individual Flowers") return p.categoryId === 3 || cName.toLowerCase().includes("individual") || cName.toLowerCase().includes("flower");
                          return false;
                        }).length;

                  return (
                    <button
                      key={cat}
                      className={`filter-pill ${categoryFilter === cat ? "active" : ""}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                      <span className="filter-count-badge">{count}</span>
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="loading-spinner-wrapper">
                  <RefreshCw size={28} className="spinner-icon" />
                  <p>Loading products catalog from database...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-products-view">
                  <Package size={36} strokeWidth={1.5} style={{ color: "#aaa" }} />
                  <h4>No Products Found</h4>
                  <p>
                    {searchQuery
                      ? `No items match "${searchQuery}" in ${categoryFilter} category.`
                      : `No products available in ${categoryFilter} category.`}
                  </p>
                </div>
              ) : viewMode === "list" ? (
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
                      {filteredProducts.map((prod) => {
                        const status = getStockStatus(prod.stockQuantity);
                        const categoryName = getCategoryName(prod);
                        const displayPrice = `Rs. ${Number(prod.price || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`;

                        return (
                          <tr key={prod.id}>
                            <td className="image-cell">
                              <img
                                src={getProductImage(prod)}
                                alt={prod.productName}
                                className="product-thumb"
                              />
                            </td>
                            <td className="name-cell">
                              <strong>{prod.productName}</strong>
                            </td>
                            <td className="category-cell">{categoryName}</td>
                            <td className="price-cell">{displayPrice}</td>
                            <td className="stock-cell">{prod.stockQuantity || 0} units</td>
                            <td className="status-cell">
                              <span className={`status-pill ${status.key}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <button
                                className="action-icon-btn edit-btn"
                                onClick={() => handleOpenEdit(prod)}
                                aria-label="Edit product"
                                title="Edit Price / Stock"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                className="action-icon-btn delete-btn"
                                onClick={() => handleDelete(prod.id, prod.productName)}
                                aria-label="Delete product"
                                title="Delete product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Grid View */
                <div className="products-grid-custom">
                  {filteredProducts.map((prod) => {
                    const status = getStockStatus(prod.stockQuantity);
                    const categoryName = getCategoryName(prod);
                    const displayPrice = `Rs. ${Number(prod.price || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;

                    return (
                      <div className="product-grid-card" key={prod.id}>
                        <div className="card-image-wrapper">
                          <img
                            src={getProductImage(prod)}
                            alt={prod.productName}
                            className="card-thumb"
                          />
                          <span className={`status-pill-absolute ${status.key}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="card-details">
                          <h4>{prod.productName}</h4>
                          <p className="card-category">{categoryName}</p>
                          <div className="card-footer">
                            <span className="card-price">{displayPrice}</span>
                            <span className="card-stock">{prod.stockQuantity || 0} left</span>
                          </div>
                          <div className="card-actions">
                            <button
                              className="card-action-btn edit"
                              onClick={() => handleOpenEdit(prod)}
                              aria-label="Edit"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              className="card-action-btn delete"
                              onClick={() => handleDelete(prod.id, prod.productName)}
                              aria-label="Delete"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : null}

          {activeTab === "categories" && (
            <div className="placeholder-tab-content">
              <h3>Categories Management</h3>
              <p>Manage floral categories (Bouquets, Head Dresses, Individual Flowers), tags, and sub-collections.</p>
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
              <h3>{totalSku}</h3>
            </div>
            <div className="kpi-icon-block">
              <Package size={24} strokeWidth={1.8} />
            </div>
          </div>

          {/* Card 2: ACTIVE CATEGORIES */}
          <div className="kpi-card-custom categories-card">
            <div className="kpi-info-block">
              <h5>ACTIVE CATEGORIES</h5>
              <h3>{activeCategoriesCount}</h3>
            </div>
            <div className="kpi-icon-block">
              <Shapes size={24} strokeWidth={1.8} />
            </div>
          </div>

          {/* Card 3: INVENTORY VALUE */}
          <div className="kpi-card-custom value-card">
            <div className="kpi-info-block">
              <h5>INVENTORY VALUE</h5>
              <h3>{formattedInventoryValue}</h3>
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

