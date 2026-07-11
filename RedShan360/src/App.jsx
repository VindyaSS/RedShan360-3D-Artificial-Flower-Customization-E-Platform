import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeDashboard from "./pages/Employee/employeeDashboard";
import LoginPage from "./pages/Login_Register/Login_Page";
import RegistrationPage from "./pages/Login_Register/Registration";
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
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrderManagement from "./pages/Admin/AdminOrderManagement";
import AdminReportsAnalytics from "./pages/Admin/AdminReportsAnalytics/AdminReportsAnalytics";
import AdminSettings from "./pages/Admin/AdminSettings/AdminSettings";
import AdminProductManagement from "./pages/Admin/AdminProductManagement";

















{/* Rout try by Vindya-start */ }
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
{/* Rout try by Vindya-end */ }





const ProtectedRoute = ({ children }) => {
  const savedUser = localStorage.getItem('user');
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user from localStorage in ProtectedRoute:', e);
    }
  }

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        window.dispatchEvent(new Event('show-login-required'));
      }, 150);
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div>
        <Routes>
          <Route path="/" element={<GuestUserDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/employeeDashboard" element={<EmployeeDashboard />} />

          <Route path="/guestUserDashboard" element={<GuestUserDashboard />} />
          <Route path="/customization" element={<ProtectedRoute><BoquetCustomization /></ProtectedRoute>} />
          <Route path="/customize" element={<ProtectedRoute><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/loyalty" element={<ProtectedRoute><GuestUserDashboard /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/loyalty-points" element={<ProtectedRoute><LoyaltyPoints /></ProtectedRoute>} />

          <Route path="/guestUserDashboard" element={<GuestUserDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminUserManagement" element={<AdminUserManagement />} />
          <Route path="/adminOrderManagement" element={<AdminOrderManagement />} />
          <Route path="/adminReports" element={<AdminReportsAnalytics />} />
          <Route path="/adminSettings" element={<AdminSettings />} />
          <Route path="/adminProductManagement" element={<AdminProductManagement />} />















          {/* Rout try by Vindya-start */}

          <Route path="/sideNavigation" element={<SideNavigation />} />
          <Route path="/mOrderTable" element={<MOrderTable />} />
          <Route path="/mTabs" element={<MTabs />} />
          <Route path="/mManageOrders" element={<MmanageOrders />} />
          <Route path="/mOCards" element={<MOCards />} />
          <Route path="/mOCards" element={<MOCards />} />
          <Route path="/managerOverview" element={<ManagerOverview />} />
          <Route path="/managerDashboard" element={<ManagerOverview />} />
          <Route path="/mOrderGraph" element={<MOrderGraph />} />
          <Route path="/mManageEmployees" element={<MmanageEmployees />} />
          <Route path="/mManageProducts" element={<MmanageProducts />} />
          <Route path="/eCustomizedProducts" element={<EcustomizedProducts />} />

          {/* Rout try by Vindya-end */}


          {/* Protected Routes */}
          {/*for example */}
          {/*<Route
              path="/EmployeeHome"
              element={isLoggedIn ? <LHome /> : <Navigate to="/login" />}
          />*/}
        </Routes>

      </div>
    </Router>
  );

}

export default App;
