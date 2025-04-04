import React, { useState } from 'react';
import { Guitar as Hospital, Users, FileUp, AlertCircle, Activity, Calendar, UserPlus, ClipboardList } from 'lucide-react';
import axios from 'axios';
import getContract from '../utils/contract';
import './HospitalDashboard.css';

const navItems = [
  { icon: Users, text: "Register Patient", section: "registerPatient" },
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

  // Patient registration
  const registerPatient = async () => {
    try {
      setIsLoading(true);
  
      // Step 1: Register the patient in the smart contract
      const contract = await getContract();
      const tx = await contract.registerPatient(walletAddress);
      await tx.wait(); // Wait for the transaction to be confirmed
  
      console.log("Patient registered in the smart contract.");
  
      // Step 2: Call the backend to create a folder and update the CID
      const response = await axios.post(" https://mini-project-backend-3ao5.onrender.com/create-folder", {
        patientAddress: walletAddress,
      });
  
      if (response.data.uniqueId) {
        setMessage(`Patient ${walletAddress} registered and CID created successfully!`);
      }
    } catch (error) {
      setMessage("Error: " + (error.message || "Failed to register patient and create CID."));
      console.error("Error in registerPatient:", error);
    } finally {
      setIsLoading(false);
    }
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
      const response = await axios.post(" https://mini-project-backend-3ao5.onrender.com/get-patient-cid", {
        uniqueId: patientCID,
        patientad: walletAddress,
        signerAddress,
      });
  
      const { ipfsLink } = response.data;
      console.log("IPFS Link:", ipfsLink);
  
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Patient Details</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                font-family: Arial, sans-serif;
              }
              .navbar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 50px;
                background-color: #2563eb;
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
              }
              .navbar h1 {
                font-size: 1.25rem;
                font-weight: 600;
                margin: 0;
              }
              .navbar button {
                background: none;
                border: none;
                color: white;
                font-size: 1rem;
                cursor: pointer;
              }
              #pdf-viewer {
                position: fixed;
                top: 50px;
                left: 0;
                width: 100%;
                height: calc(100% - 50px);
                overflow: auto;
              }
              canvas {
                display: block;
                margin: 0 auto;
              }
            </style>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js" integrity="sha512-ml/QKfG3+Yes6TwOzQb7aCNtJF4PUyha6R3w8pSTo/VJSywl7ZreYvvtUso7fKevpsI+pYVVwnu82YO0q3V6eg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
          </head>
          <body>
            <div class="navbar">
              <h1>Patient Details</h1>
            
            </div>
            <div id="pdf-viewer"></div>
            <script>
              const url = "${ipfsLink}";
              const container = document.getElementById('pdf-viewer');
  
              pdfjsLib.getDocument(url).promise.then(pdf => {
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                  pdf.getPage(pageNum).then(page => {
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
  
                    container.appendChild(canvas);
  
                    const renderContext = {
                      canvasContext: context,
                      viewport: viewport,
                    };
                    page.render(renderContext);
                  });
                }
              }).catch(error => {
                console.error('Error loading PDF:', error);
                alert('Failed to load PDF. Please check the link.');
              });
            </script>
          </body>
          </html>
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

      await axios.post(" https://mini-project-backend-3ao5.onrender.com/update-cid", formData, {
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
          <p className="brand-subtitle">Hospital Dashboard</p>
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