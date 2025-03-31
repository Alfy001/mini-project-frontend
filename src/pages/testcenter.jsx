import React, { useState } from 'react';
import { Guitar as Hospital, Users, FileUp, AlertCircle, Activity, Calendar, UserPlus, ClipboardList } from 'lucide-react';
import axios from 'axios';
import getContract from '../utils/contract';
import './HospitalDashboard.css';

const navItems = [
  //{ icon: Users, text: "Register Patient", section: "registerPatient" },
  { icon: Hospital, text: "Get Patient Details", section: "fetchDetails" },
  { icon: FileUp, text: "Update Patient Details", section: "updateDetails" },
];

const statsCards = [
  { icon: UserPlus, label: "New Patients", value: "124", trend: "+12.5%" },
  { icon: Activity, label: "Active Records", value: "1,432", trend: "+8.2%" },
  { icon: Calendar, label: "Updates Today", value: "48", trend: "+22.4%" },
  { icon: ClipboardList, label: "Total Records", value: "3,642", trend: "+15.8%" },
];

function HospitalDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("registerPatient");
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (section) => {
    setActiveSection(section);
    setMessage("");
  };

  // Fetch patient details
  const fetchPatientDetails = async () => {
    try {
      setIsLoading(true);
      const contract = await getContract();
      const patientCID = await contract.getPatientCID(walletAddress);

      if (patientCID === "pending") {
        setMessage("Patient CID is still pending registration.");
        return;
      }

      const signerAddress = await contract.signer.getAddress();
      const response = await axios.post("https://mini-project-backend-3ao5.onrender.com//get-patient-cid", {
        uniqueId: patientCID,
        patientad: walletAddress,
        signerAddress,
      });

      const { ipfsLink } = response.data;

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <iframe 
            src="${ipfsLink}" 
            width="100%" 
            height="100%" 
            style="border:none;"
          ></iframe>
        `);
        setMessage("Patient details retrieved successfully.");
      } else {
        setMessage("Error: Unable to open a new tab.");
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Update patient details
  const updatePatientDetails = async () => {
    if (!file) {
      setMessage("Please upload a file before updating.");
      return;
    }

    try {
      setIsLoading(true);
      const contract = await getContract();
      const patientCID = await contract.getPatientCID(walletAddress);

      if (patientCID === "pending") {
        setMessage("Patient CID is still pending registration.");
        return;
      }

      const signerAddress = await contract.signer.getAddress();
      const formData = new FormData();
      formData.append("uniqueId", patientCID);
      formData.append("patientAddress", walletAddress);
      formData.append("signerAddress", signerAddress);
      formData.append("file", file);

      await axios.post("https://mini-project-backend-3ao5.onrender.com//update-cid", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Patient details updated successfully.");
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = () => {
    switch (activeSection) {
      case "registerPatient":
        return registerPatient();
      case "fetchDetails":
        return fetchPatientDetails();
      case "updateDetails":
        return updatePatientDetails();
      default:
        return;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="brand-title">HealthLink</h1>
          <p className="brand-subtitle">TestCenter</p>
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
                Manage patient records securely on the blockchain
              </p>
            </div>

            <div className="form-container">
              <div className="form-group">
                <label className="form-label">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="form-input"
                  placeholder="Enter wallet address"
                />
              </div>

              {activeSection === "updateDetails" && (
                <div className="form-group">
                  <label className="form-label">
                    Upload File
                  </label>
                  <div className="file-upload-container">
                    <div className="file-upload-content">
                      <FileUp className="upload-icon" />
                      <div className="upload-text">
                        <label className="upload-label">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="hidden-input"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                          />
                        </label>
                        <p>or drag and drop</p>
                      </div>
                      <p className="upload-hint">
                        PDF, DOC up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAction}
                disabled={!walletAddress || (activeSection === "updateDetails" && !file) || isLoading}
                className={`action-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? "Processing..." : 
                 activeSection === "registerPatient" ? "Register Patient" :
                 activeSection === "fetchDetails" ? "Get Details" :
                 "Update Details"}
              </button>

              {message && (
                <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
                  <AlertCircle className="message-icon" />
                  <p>{message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="activity-section">
            <h3 className="activity-title">Recent Activity</h3>
            <div className="activity-list">
              {[
                { action: "Patient Registered", time: "2 minutes ago", status: "success" },
                { action: "Records Updated", time: "15 minutes ago", status: "success" },
                { action: "Access Request", time: "1 hour ago", status: "pending" },
                { action: "System Backup", time: "3 hours ago", status: "success" }
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

export default HospitalDashboard;