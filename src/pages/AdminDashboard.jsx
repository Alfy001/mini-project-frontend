import React, { useState } from 'react';
import { Shield, Users, FileText, AlertCircle, Activity, Calendar, Building2, ClipboardList } from 'lucide-react';
import axios from 'axios';
import getContract from '../utils/contract';
import './AdminDashboard.css';

const navItems = [
  { icon: Users, text: "Register Hospital", section: "registerHospital" },
  { icon: Building2, text: "Revoke Hospital", section: "revokeHospital" },
  { icon: FileText, text: "Hospital Details", section: "fetchDetails" },
  { icon: Shield, text: "Unregister Patient", section: "unregisterPatient" },
];

const statsCards = [
  { icon: Building2, label: "Active Hospitals", value: "48", trend: "+5.2%" },
  { icon: Activity, label: "System Events", value: "2,845", trend: "+12.3%" },
  { icon: Calendar, label: "Daily Updates", value: "156", trend: "+8.7%" },
  { icon: ClipboardList, label: "Total Records", value: "12,654", trend: "+15.1%" },
];

function AdminDashboard() {
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalPhysicalAddress, setHospitalPhysicalAddress] = useState("");
  const [hospitalMapLink, setHospitalMapLink] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("registerHospital");
  const [isLoading, setIsLoading] = useState(false);
  const [hospitalDetails, setHospitalDetails] = useState(null);

  const handleNavigation = (section) => {
    setActiveSection(section);
    setMessage("");
  };

  const registerHospital = async () => {
    try {
      setIsLoading(true);
      const contract = await getContract();
      const tx = await contract.registerHospital(
        hospitalAddress,
        hospitalName,
        hospitalPhysicalAddress,
        hospitalMapLink
      );
      await tx.wait();
      setMessage(`Hospital "${hospitalName}" registered successfully.`);
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const revokeHospital = async () => {
    try {
      setIsLoading(true);
      const contract = await getContract();
      const tx = await contract.revokeHospital(hospitalAddress);
      await tx.wait();
      setMessage(`Hospital ${hospitalAddress} revoked successfully.`);
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHospitalDetails = async () => {
    try {
      setIsLoading(true);
      const contract = await getContract();
      const details = await contract.getHospitalDetails(hospitalAddress);
      setHospitalDetails({
        isRegistered: details[0],
        name: details[1],
        physicalAddress: details[2],
        mapLink: details[3],
      });
      setMessage("");
    } catch (error) {
      console.error("Error fetching hospital details:", error);
      setMessage("Error: Unable to fetch hospital details.");
    } finally {
      setIsLoading(false);
    }
  };

  const unregisterPatient = async () => {
    try {
      setIsLoading(true);
      const contract = await getContract();
      const tx = await contract.unregisterPatient(patientAddress);
      await tx.wait();
      setMessage(`Patient ${patientAddress} unregistered successfully.`);
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = () => {
    switch (activeSection) {
      case "registerHospital":
        return registerHospital();
      case "revokeHospital":
        return revokeHospital();
      case "fetchDetails":
        return fetchHospitalDetails();
      case "unregisterPatient":
        return unregisterPatient();
      default:
        return;
    }
  };

  const renderForm = () => {
    switch (activeSection) {
      case "registerHospital":
        return (
          <>
            <div className="form-group">
              <label className="form-label">Hospital Wallet Address</label>
              <input
                type="text"
                value={hospitalAddress}
                onChange={(e) => setHospitalAddress(e.target.value)}
                className="form-input"
                placeholder="Enter hospital wallet address"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hospital Name</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="form-input"
                placeholder="Enter hospital name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Physical Address</label>
              <input
                type="text"
                value={hospitalPhysicalAddress}
                onChange={(e) => setHospitalPhysicalAddress(e.target.value)}
                className="form-input"
                placeholder="Enter physical address"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Google Maps Link</label>
              <input
                type="text"
                value={hospitalMapLink}
                onChange={(e) => setHospitalMapLink(e.target.value)}
                className="form-input"
                placeholder="Enter Google Maps link"
              />
            </div>
          </>
        );
      case "revokeHospital":
      case "fetchDetails":
        return (
          <div className="form-group">
            <label className="form-label">Hospital Wallet Address</label>
            <input
              type="text"
              value={hospitalAddress}
              onChange={(e) => setHospitalAddress(e.target.value)}
              className="form-input"
              placeholder="Enter hospital wallet address"
            />
          </div>
        );
      case "unregisterPatient":
        return (
          <div className="form-group">
            <label className="form-label">Patient Wallet Address</label>
            <input
              type="text"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              className="form-input"
              placeholder="Enter patient wallet address"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="brand-title">HealthLink</h1>
          <p className="brand-subtitle">Admin Dashboard</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.section}
                onClick={() => handleNavigation(item.section)}
                className={`nav-item ${activeSection === item.section ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.text}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Stats Grid */}
          <div className="stats-grid">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className="stat-icon">
                    <Icon size={24} />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-label">{stat.label}</h3>
                    <p className="stat-value">{stat.value}</p>
                    <span className="stat-trend">{stat.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="content-card">
            <div className="card-header">
              <h2 className="section-title">
                {navItems.find(item => item.section === activeSection)?.text}
              </h2>
              <p className="section-description">
                Manage hospitals and patients on the blockchain
              </p>
            </div>

            <div className="form-container">
              {renderForm()}

              <button
                onClick={handleAction}
                disabled={isLoading}
                className={`action-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? "Processing..." : 
                 activeSection === "registerHospital" ? "Register Hospital" :
                 activeSection === "revokeHospital" ? "Revoke Hospital" :
                 activeSection === "fetchDetails" ? "Get Details" :
                 "Unregister Patient"}
              </button>

              {message && (
                <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
                  <AlertCircle className="message-icon" />
                  <p>{message}</p>
                </div>
              )}

              {hospitalDetails && activeSection === "fetchDetails" && (
                <div className="hospital-details">
                  <h3>Hospital Information</h3>
                  <p><strong>Name:</strong> {hospitalDetails.name}</p>
                  <p><strong>Address:</strong> {hospitalDetails.physicalAddress}</p>
                  <p><strong>Map Link:</strong> <a href={hospitalDetails.mapLink} target="_blank" rel="noopener noreferrer">{hospitalDetails.mapLink}</a></p>
                  <p><strong>Status:</strong> {hospitalDetails.isRegistered ? "Registered" : "Not Registered"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="activity-section">
            <h3 className="activity-title">Recent Activity</h3>
            <div className="activity-list">
              {[
                { action: "Hospital Registered", time: "5 minutes ago", status: "success" },
                { action: "Patient Unregistered", time: "30 minutes ago", status: "success" },
                { action: "Hospital Details Updated", time: "2 hours ago", status: "success" },
                { action: "System Maintenance", time: "4 hours ago", status: "pending" }
              ].map((activity, index) => (
                <div key={index} className={`activity-item ${activity.status}`}>
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;