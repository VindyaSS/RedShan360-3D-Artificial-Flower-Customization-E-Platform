import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeDashboard from "./pages/Employee/employeeDashboard";
import LoginPage from "./pages/Login_Register/Login_Page";
import RegistrationPage from "./pages/Login_Register/Registration";
import GuestUserDashboard from './pages/GuestUser/guestUserDashboard';



import BoquetCustomization from './pages/Customization/Boquet_Customization';
import Shop from './pages/GuestUser/Shop';
import ProductDetails from './pages/GuestUser/ProductDetails';
import ScrollToTop from './components/ScrollToTop';
import CategoryPage from './pages/GuestUser/CategoryPage';
import AboutPage from './pages/GuestUser/AboutPage';
import ContactPage from './pages/GuestUser/ContactPage';
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminDashboard from "./pages/Admin/AdminDashboard";

















{/* Rout try by Vindya-start */ }
import SideNavigation from './components/managerComponent/sideNavigation';
import MOrderTable from './components/managerComponent/MPendingOrderTable';
import MTabs from './components/managerComponent/mTabs';
import MmanageOrders from './pages/Manager/MmanageOrders';
import MOCards from './components/managerComponent/MOrderCard';

import ManagerOverview from './pages/Manager/ManagerOverview';
import MOrderGraph from './components/managerComponent/MOrderGraph';
{/* Rout try by Vindya-end */ }





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
          <Route path="/customization" element={<BoquetCustomization />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/guestUserDashboard" element={<GuestUserDashboard />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminUserManagement" element={<AdminUserManagement />} />














          {/* Rout try by Vindya-start */}

          <Route path="/sideNavigation" element={<SideNavigation />} />
          <Route path="/mOrderTable" element={<MOrderTable />} />
          <Route path="/mTabs" element={<MTabs />} />
          <Route path="/mManageOrders" element={<MmanageOrders />} />
          <Route path="/mOCards" element={<MOCards />} />
          <Route path="/mOCards" element={<MOCards />} />
          <Route path="/managerOverview" element={<ManagerOverview />} />
          <Route path="/mOrderGraph" element={<MOrderGraph />} />


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
