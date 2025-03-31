import React, { useState } from 'react';
import { Hospital, AlertCircle, Heart } from 'lucide-react';
import axios from 'axios';
import getContract from '../utils/contract';
import './HospitalDashboard.css';

const navItems = [
  { icon: Hospital, text: "Get Patient Details", section: "fetchDetails" },
  { icon: Heart, text: "Pulse Measurement", section: "pulseMeasurement" },
];

function PatientDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [heartRates, setHeartRates] = useState([]);
  const [averageHeartRate, setAverageHeartRate] = useState(null);
  const [currentHeartRate, setCurrentHeartRate] = useState(null);

  // Fetch patient details from the blockchain
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
      const response = await axios.post("http://192.168.215.3:3000/get-patient-cid", {
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

  // Start pulse measurement
  const startPulseMeasurement = async () => {
    setIsMeasuring(true);
    setHeartRates([]);
    setAverageHeartRate(null);
    setCurrentHeartRate(null);

    const interval = setInterval(async () => {
      try {
        const response = await axios.get('http://192.168.215.3:6547/hr'); // Fetch heart rate from Python backend
        const hr = parseInt(response.data, 10);
        if (!isNaN(hr)) {
          setCurrentHeartRate(hr); // Update current heart rate
          setHeartRates((prev) => [...prev, hr]); // Add to heart rate history
        } else {
          console.error('Invalid heart rate value received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching heart rate:', error.message);
      }
    }, 1000); // Fetch heart rate every second

    // Stop measuring after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsMeasuring(false);
      calculateAverageHeartRate();
    }, 30000);
  };

  // Calculate average heart rate
  const calculateAverageHeartRate = () => {
    if (heartRates.length > 0) {
      const sum = heartRates.reduce((a, b) => a + b, 0);
      const avg = sum / heartRates.length;
      setAverageHeartRate(avg.toFixed(2));
    }
  };

  // Handle actions based on the selected section
  const handleAction = (section) => {
    if (section === "fetchDetails") {
      fetchPatientDetails();
    } else if (section === "pulseMeasurement") {
      startPulseMeasurement();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="brand-title">HealthLink</h1>
          <p className="brand-subtitle">Patient Dashboard</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.section}
                onClick={() => handleAction(item.section)}
                className={`nav-item`}
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
        {/* Get Patient Details Section */}
        {!isMeasuring && (
          <div className="content-wrapper">
            <div className="content-card">
              <div className="card-header">
                <h2 className="section-title">
                  Get Patient Details
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

                <button
                  onClick={() => handleAction("fetchDetails")}
                  disabled={!walletAddress || isLoading}
                  className={`action-button ${isLoading ? 'loading' : ''}`}
                >
                  {isLoading ? "Processing..." : "Get Details"}
                </button>

                {message && (
                  <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
                    <AlertCircle className="message-icon" />
                    <p>{message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pulse Measurement Section */}
        {isMeasuring && (
          <div className="content-wrapper">
            <div className="content-card">
              <div className="card-header">
                <h2 className="section-title">
                  Pulse Measurement
                </h2>
                <p className="section-description">
                  Measuring your heart rate. Please wait...
                </p>
              </div>

              <div className="form-container">
                <div className="heart-rate-display">
                  <h3>Current Heart Rate: {currentHeartRate || '--'} BPM</h3>
                  <h3>Average Heart Rate: {averageHeartRate || '--'} BPM</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;