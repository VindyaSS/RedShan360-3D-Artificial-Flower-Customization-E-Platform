
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeDashboard from "./pages/Employee/employeeDashboard";
import LoginPage from "./components/Login_Register/Login_Page";
import RegistrationPage from "./components/Login_Register/Registration";
import GuestUserDashboard from './pages/GuestUser/guestUserDashboard';


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
