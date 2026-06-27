import React from "react";
import "./AdminTopSellingProducts.css";

// Import local flower assets
import crimsonSilkPeony from "../../../assets/crimson_silk_peony.jpg";
import moonlightVelvetTulip from "../../../assets/moonlight_velvet_tulip.jpg";
import serenityWhite from "../../../assets/serenity_white.jpg";

// Map names to imported assets
const imageMap = {
  "crimson_silk_peony.jpg": crimsonSilkPeony,
  "moonlight_velvet_tulip.jpg": moonlightVelvetTulip,
  "serenity_white.jpg": serenityWhite,
};

function AdminTopSellingProducts({ products }) {
  if (!products) return null;

  return (
    <div className="top-selling-card">
      <div className="top-selling-header">
        <h3>Top Selling Products</h3>
        <button className="view-all-inventory-btn">View All Inventory</button>
      </div>

      <div className="table-responsive">
        <table className="products-table">
          <thead>
            <tr>
              <th>PRODUCT DETAILS</th>
              <th>SALES COUNT</th>
              <th>STOCK STATUS</th>
              <th>TREND</th>
              <th className="text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const imageSrc = imageMap[product.imageName] || serenityWhite;
              const isPositive = product.trend >= 0;

              return (
                <tr key={product.id}>
                  <td>
                    <div className="product-details-cell">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="product-thumbnail"
                      />
                      <div className="product-meta">
                        <span className="product-name">{product.name}</span>
                        <span className="product-sku">SKU: {product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="sales-count-text">
                      {product.unitsSold.toLocaleString()} Units
                    </span>
                  </td>
                  <td>
                    <span
                      className={`stock-badge ${
                        product.stockStatus === "IN STOCK"
                          ? "in-stock"
                          : "low-stock"
                      }`}
                    >
                      {product.stockStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`trend-text ${isPositive ? "up" : "down"}`}>
                      {isPositive ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="trend-icon"
                        >
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                          <polyline points="17 6 23 6 23 12"></polyline>
                        </svg>
                      ) : (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="trend-icon"
                        >
                          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                          <polyline points="17 18 23 18 23 12"></polyline>
                        </svg>
                      )}
                      {isPositive ? `+${product.trend}%` : `${product.trend}%`}
                    </span>
                  </td>
                  <td className="text-right">
                    <button className="action-menu-btn">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4f4f4f"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTopSellingProducts;
