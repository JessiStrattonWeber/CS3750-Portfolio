import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home.js";
import Login from "./components/login.js";
import Logout from "./components/logout.js";
import MyAccount from "./components/my-account.js";
import EmployeeDashboard from './components/employee-dash.js';
import Footer from "./components/footer.js";
import EditRecords from "./components/edit-record.js";
import EmployeeSummary from "./components/employee-summary.js";


import './styles.css';
import { AuthProvider } from "./components/authentication.js";

const App = () => {
  return (
    <AuthProvider>
      <div className="root background">
        <div className="main-content">
          <Home />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/employee-dash" element={<EmployeeDashboard />} />
            <Route path="/edit-record/:id" element={<EditRecords />} />
            <Route path="/employee-summary/:id" element={<EmployeeSummary />} />
          

          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
