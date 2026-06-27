/**
 * AdminReportService.js
 * Responsible for communicating with the backend (simulated PHP APIs / Database).
 * Fetches analytics, reports, revenue data, and customer insights based on selected date ranges.
 */

// Simulated database delay to mimic HTTP requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const AdminReportService = {
  /**
   * Fetches revenue KPI metrics (Daily, Weekly, Monthly) and their growth comparison metrics.
   * @param {string} period - Selected period filter (e.g. 'Today', 'Last 7 Days', 'Last 30 Days', etc.)
   */
  getRevenueSummary: async (period) => {
    await delay(400); // simulate network lag

    // Modify values slightly based on period to show a dynamic UI
    let dailyVal = 4850.00;
    let dailyChange = 12;
    let weeklyVal = 32410.00;
    let weeklyChange = 8;
    let monthlyVal = 128900.00;
    let monthlyChange = 24;

    if (period === "Today") {
      dailyVal = 4850.00;
      dailyChange = 12;
      weeklyVal = 4850.00; // only today has happened this week
      weeklyChange = 0;
      monthlyVal = 4850.00;
      monthlyChange = 0;
    } else if (period === "Last 7 Days") {
      dailyVal = 3950.00;
      dailyChange = -3;
      weeklyVal = 27650.00;
      weeklyChange = 4;
      monthlyVal = 104200.00;
      monthlyChange = 15;
    } else if (period === "Last Month") {
      dailyVal = 4500.00;
      dailyChange = 5;
      weeklyVal = 31200.00;
      weeklyChange = 6;
      monthlyVal = 119500.00;
      monthlyChange = 18;
    }

    return {
      daily: {
        amount: dailyVal,
        change: dailyChange,
      },
      weekly: {
        amount: weeklyVal,
        change: weeklyChange,
      },
      monthly: {
        amount: monthlyVal,
        change: monthlyChange,
      }
    };
  },

  /**
   * Fetches revenue growth data (grouped by month) for the Bar Chart.
   * @param {string} period
   */
  getRevenueGrowthData: async (period) => {
    await delay(500);

    const baseData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      values: [35000, 48000, 39000, 62000, 58000, 85000, 80000]
    };

    if (period === "Today") {
      return {
        labels: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
        values: [800, 1200, 1500, 750, 600, 0]
      };
    } else if (period === "Last 7 Days") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [3500, 4200, 3900, 4500, 5100, 5800, 5410]
      };
    }

    return baseData;
  },

  /**
   * Fetches performance metrics (percentages) for product categories.
   * @param {string} period
   */
  getCategoryPerformance: async (period) => {
    await delay(450);

    return [
      { category: "Silk Peonies", percentage: 85 },
      { category: "Velvet Roses", percentage: 72 },
      { category: "Ceramic Vases", percentage: 45 },
      { category: "Orchids", percentage: 92 }
    ];
  },

  /**
   * Fetches customer insight statistics (New, Active, Returning).
   * @param {string} period
   */
  getCustomerInsights: async (period) => {
    await delay(400);

    if (period === "Today") {
      return { newCustomers: 4, activeCustomers: 28, returningCustomers: 8 };
    } else if (period === "Last 7 Days") {
      return { newCustomers: 34, activeCustomers: 242, returningCustomers: 85 };
    }

    return {
      newCustomers: 124,
      activeCustomers: 842,
      returningCustomers: 312
    };
  },

  /**
   * Fetches order processing and status fulfillment counts.
   * @param {string} period
   */
  getOrderFulfillment: async (period) => {
    await delay(450);

    if (period === "Today") {
      return { total: 12, pending: 2, completed: 10, cancelled: 0 };
    } else if (period === "Last 7 Days") {
      return { total: 68, pending: 9, completed: 57, cancelled: 2 };
    }

    return {
      total: 2401,
      pending: 45,
      completed: 2320,
      cancelled: 36
    };
  },

  /**
   * Fetches list of top 4 best-selling products.
   * @param {string} period
   */
  getTopSellingProducts: async (period) => {
    await delay(550);

    // List of products with status, image filename, sku, units sold, trend
    return [
      {
        id: 1,
        name: "Eternal Silk Peony",
        sku: "RS-SP-001",
        imageName: "crimson_silk_peony.jpg",
        unitsSold: 1240,
        stockStatus: "IN STOCK",
        trend: 12.5
      },
      {
        id: 2,
        name: "Midnight Velvet Rose",
        sku: "RS-VR-092",
        imageName: "moonlight_velvet_tulip.jpg", // mapping to an existing asset
        unitsSold: 892,
        stockStatus: "LOW STOCK",
        trend: 5.2
      },
      {
        id: 3,
        name: "Ivory Orchid Stem",
        sku: "RS-IO-441",
        imageName: "serenity_white.jpg",
        unitsSold: 754,
        stockStatus: "IN STOCK",
        trend: -2.1
      },
      {
        id: 4,
        name: "Royal Bloom Tulip",
        sku: "RS-RT-552",
        imageName: "serenity_white.jpg",
        unitsSold: 645,
        stockStatus: "IN STOCK",
        trend: 3.8
      }
    ];
  },

  /**
   * Exports report as a PDF document.
   * @param {string} period
   */
  exportPDFReport: async (period) => {
    await delay(1200); // Simulates file processing/generation time
    return {
      success: true,
      message: `Report exported successfully as RedShan360-Analytics-${period.replace(/\s+/g, "-")}.pdf`,
      downloadUrl: "#"
    };
  }
};
