
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeDashboard from "./pages/Employee/employeeDashboard";
import LoginPage from "./components/Login_Register/Login_Page";
import RegistrationPage from "./components/Login_Register/Registration";
import GuestUserDashboard from './pages/GuestUser/guestUserDashboard';
import AdminUserManagement from "./pages/Admin/AdminUserManagement";
import AdminDashboard from "./pages/Admin/AdminDashboard";



function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/employeeDashboard" element={<EmployeeDashboard />} />
            <Route path="/guestUserDashboard" element={<GuestUserDashboard/>}/>
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/adminUserManagement" element={<AdminUserManagement />} />
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
