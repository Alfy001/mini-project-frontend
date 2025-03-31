import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import TestCenter from "./pages/testcenter"; // Ensure this import is correct
import PatientDashboard from "./pages/patientDashboard"; // Ensure this import is correct
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/testcenter" element={<TestCenter />} />
          <Route path="/home" element={<Home />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;