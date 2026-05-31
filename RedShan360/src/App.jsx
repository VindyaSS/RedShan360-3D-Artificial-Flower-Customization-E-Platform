import employeeDashboard from "./pages/Employee/employeeDashboard";


function App() {


  return (
    <Router>
      <div>
        <Routes>
                    <Route path="/employeeDashboard" element={< employeeDashboard/>} />






          {/* Protected Routes */}
            {/*for example */}
              {/*<Route
                  path="/EmployeeHome"
                  element={isLoggedIn ? <LHome /> : <Navigate to="/login" />}
              />*/}

        </Routes>

      </div>

    </Router>
  )
}

export default App
