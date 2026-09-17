import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/Unauthorized/UnauthorizedPage';

import EmployeeDashboard from "./pages/Employee/employeeDashboard";
import LoginPage from "./pages/Login_Register/Login_Page";
import RegistrationPage from "./pages/Login_Register/Registration";
import ForgotPasswordPage from "./pages/Login_Register/ForgotPassword";
import GuestUserDashboard from './pages/GuestUser/guestUserDashboard';

import BoquetCustomization from './pages/Customization/Boquet_Customization';
import Shop from './pages/GuestUser/Shop';
import Wishlist from './pages/GuestUser/Wishlist';
import ProductDetails from './pages/GuestUser/ProductDetails';
import ScrollToTop from './components/ScrollToTop';
import CategoryPage from './pages/GuestUser/CategoryPage';
import AboutPage from './pages/GuestUser/AboutPage';
import ContactPage from './pages/GuestUser/ContactPage';
import LoyaltyPoints from './pages/GuestUser/LoyaltyPoints';
import CustomerOrders from './pages/GuestUser/CustomerOrders';

import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrderManagement from "./pages/Admin/AdminOrderManagement";
import AdminReportsAnalytics from "./pages/Admin/AdminReportsAnalytics/AdminReportsAnalytics";
import AdminSettings from "./pages/Admin/AdminSettings/AdminSettings";
import AdminProductManagement from "./pages/Admin/AdminProductManagement";

import SideNavigation from './components/managerComponent/sideNavigation';
import MOrderTable from './components/managerComponent/MPendingOrderTable';
import MTabs from './components/managerComponent/mTabs';
import MmanageOrders from './pages/Manager/MmanageOrders';
import MOCards from './components/managerComponent/MOrderCard';
import ManagerOverview from './pages/Manager/ManagerOverview';
import MOrderGraph from './components/managerComponent/MOrderGraph';
import MmanageEmployees from './pages/Manager/ManageEmployees';
import MmanageProducts from './pages/Manager/ManageProducts';
import EcustomizedProducts from './pages/Employee/EcustomizedProducts';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div>
        <Routes>
          {/* Public / Guest Routes */}
          <Route path="/" element={<GuestUserDashboard />} />
          <Route path="/guestUserDashboard" element={<GuestUserDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Customer Protected Routes */}
          <Route path="/customization" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><BoquetCustomization /></ProtectedRoute>} />
          <Route path="/customize" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><CustomerOrders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/loyalty" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/loyalty-points" element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><LoyaltyPoints /></ProtectedRoute>} />

          {/* Employee Protected Routes */}
          <Route path="/employeeDashboard" element={<ProtectedRoute allowedRoles={["EMPLOYEE"]}><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/eCustomizedProducts" element={<ProtectedRoute allowedRoles={["EMPLOYEE"]}><EcustomizedProducts /></ProtectedRoute>} />

          {/* Manager Protected Routes */}
          <Route path="/managerOverview" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><ManagerOverview /></ProtectedRoute>} />
          <Route path="/managerDashboard" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><ManagerOverview /></ProtectedRoute>} />
          <Route path="/mManageOrders" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><MmanageOrders /></ProtectedRoute>} />
          <Route path="/mManageEmployees" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><MmanageEmployees /></ProtectedRoute>} />
          <Route path="/mManageProducts" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><MmanageProducts /></ProtectedRoute>} />
          <Route path="/sideNavigation" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><SideNavigation /></ProtectedRoute>} />
          <Route path="/mOrderTable" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><MOrderTable /></ProtectedRoute>} />
          <Route path="/mTabs" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><MTabs /></ProtectedRoute>} />
          <Route path="/mOCards" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><MOCards /></ProtectedRoute>} />
          <Route path="/mOrderGraph" element={<ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}><MOrderGraph /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/adminDashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/adminUserManagement" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUserManagement /></ProtectedRoute>} />
          <Route path="/adminOrderManagement" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminOrderManagement /></ProtectedRoute>} />
          <Route path="/adminReports" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminReportsAnalytics /></ProtectedRoute>} />
          <Route path="/adminSettings" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminSettings /></ProtectedRoute>} />
          <Route path="/adminProductManagement" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminProductManagement /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
