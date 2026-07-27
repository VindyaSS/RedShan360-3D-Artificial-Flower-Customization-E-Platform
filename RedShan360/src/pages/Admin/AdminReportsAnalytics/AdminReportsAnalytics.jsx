import React, { useState, useEffect } from "react";
import AdminSidebar from "../../../components/adminComponent/AdminSidebar";
import AdminTopbar from "../../../components/adminComponent/AdminTopbar";
import AdminReportFilter from "../../../components/adminComponent/AdminReportFilter/AdminReportFilter";
import AdminExportReport from "../../../components/adminComponent/AdminExportReport/AdminExportReport";
import AdminRevenueCards from "../../../components/adminComponent/AdminRevenueCards/AdminRevenueCards";
import AdminRevenueChart from "../../../components/adminComponent/AdminRevenueChart/AdminRevenueChart";
import AdminCategoryPerformance from "../../../components/adminComponent/AdminCategoryPerformance/AdminCategoryPerformance";
import AdminCustomerInsights from "../../../components/adminComponent/AdminCustomerInsights/AdminCustomerInsights";
import AdminOrderFulfillment from "../../../components/adminComponent/AdminOrderFulfillment/AdminOrderFulfillment";
import AdminTopSellingProducts from "../../../components/adminComponent/AdminTopSellingProducts/AdminTopSellingProducts";
import { AdminReportService } from "../../../services/AdminReportService";
import "./AdminReportsAnalytics.css";

function AdminReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [loading, setLoading] = useState(true);

  // Custom date range state
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Analytics states
  const [revenueData, setRevenueData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [fulfillmentData, setFulfillmentData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [rev, chart, cat, cust, full, prod] = await Promise.all([
          AdminReportService.getRevenueSummary(selectedPeriod, startDate, endDate),
          AdminReportService.getRevenueGrowthData(selectedPeriod, startDate, endDate),
          AdminReportService.getCategoryPerformance(selectedPeriod, startDate, endDate),
          AdminReportService.getCustomerInsights(selectedPeriod, startDate, endDate),
          AdminReportService.getOrderFulfillment(selectedPeriod, startDate, endDate),
          AdminReportService.getTopSellingProducts(selectedPeriod, startDate, endDate),
        ]);

        if (active) {
          setRevenueData(rev);
          setChartData(chart);
          setCategoryData(cat);
          setCustomerData(cust);
          setFulfillmentData(full);
          setProducts(prod);
        }
      } catch (err) {
        console.error("Failed to load report analytics", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      active = false;
    };
  }, [selectedPeriod, startDate, endDate]);


  return (
    <div className="admin-reports-page">
      {/* Sidebar navigation */}
      <AdminSidebar />

      <div className="admin-content">
        {/* Reused global top bar */}
        <AdminTopbar />

        <div className="reports-analytics-container">
          {/* Header section with page titles and actions */}
          <div className="reports-header-row">
            <div className="reports-title-block">
              <h1>Reports & Analytics</h1>
              <p>
                A comprehensive view of your luxury artificial flower business
                performance.
              </p>
            </div>

            <div className="reports-actions-block">
              {selectedPeriod === "Custom Date Range" && (
                <div className="reports-date-picker">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="reports-date-input"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="reports-date-input"
                  />
                </div>
              )}
              <AdminReportFilter
                value={selectedPeriod}
                onChange={setSelectedPeriod}
              />
              <AdminExportReport period={selectedPeriod} />
            </div>
          </div>

          {/* Loader Overlay / Skeletons */}
          {loading && !revenueData ? (
            <div className="reports-initial-loader">
              <div className="luxury-spinner"></div>
              <p>Gathering reports data...</p>
            </div>
          ) : (
            <div className={`reports-layout-grid ${loading ? "data-refreshing" : ""}`}>
              {/* Row 1: KPI Cards */}
              <div className="grid-row-full">
                <AdminRevenueCards data={revenueData} />
              </div>

              {/* Row 2: Charts and Category Performance */}
              <div className="grid-row-split-chart">
                <AdminRevenueChart chartData={chartData} />
                <AdminCategoryPerformance categoryData={categoryData} />
              </div>

              {/* Row 3: Customer Insights and Order Fulfillment */}
              <div className="grid-row-split-insights">
                <AdminCustomerInsights customerData={customerData} />
                <AdminOrderFulfillment fulfillmentData={fulfillmentData} />
              </div>

              {/* Row 4: Top Selling Products Table */}
              <div className="grid-row-full">
                <AdminTopSellingProducts products={products} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReportsAnalytics;
