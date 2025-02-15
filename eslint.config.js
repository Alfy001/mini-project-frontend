import React, { useState } from 'react';
import { Heart, Guitar as Hospital, UserCog, ChevronRight, Shield, Users, ClipboardCheck } from 'lucide-react';
import './Home.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import getContract from "../utils/contract";


function Home() {
  const loginAsAdmin = async () => {
    try {
      const contract = await getContract();
      const signerAddress = await contract.signer.getAddress();
      const isAdmin = await contract.isAdmin(signerAddress);

      if (isAdmin) {
        navigate("/admin-dashboard");
      } else {
        alert("Access Denied: You are not an admin.");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      alert("Error connecting to MetaMask: " + error.message);
    }
  };
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showHospitalLogin, setShowHospitalLogin] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    // Add your admin login logic here
  };

  const handleHospitalLogin = async (e) => {
    e.preventDefault();
    // Add your hospital login logic here
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Heart className="h-8 w-8 text-blue-600" />
            <span>MedaMex</span>
          </div>
          <div className="navbar-buttons">
            <button
              className="admin-login"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin Login
            </button>
            <button
              className="hospital-login"
              onClick={() => setShowHospitalLogin(true)}
            >
              Hospital Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Revolutionizing Healthcare Management</h1>
            <p>
              Secure, efficient, and transparent healthcare record management powered by blockchain technology.
            </p>
            <button>
              Learn More <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
              alt="Healthcare"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-content">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3>Secure Records</h3>
              <p>
                Blockchain-powered security ensuring data integrity and privacy.
              </p>
            </div>
            <div className="feature-card">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3>Multi-User Access</h3>
              <p>
                Controlled access for administrators and healthcare providers.
              </p>
            </div>
            <div className="feature-card">
              <ClipboardCheck className="h-12 w-12 text-blue-600 mb-4" />
              <h3>Easy Management</h3>
              <p>
                Streamlined processes for efficient healthcare record management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Admin Login</h2>
              <button onClick={() => setShowAdminLogin(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleAdminLogin}>
              <div>
                <label>Wallet Address</label>
                <input type="text" placeholder="Enter your wallet address" />
              </div>
              <button type="submit">
                <UserCog className="h-5 w-5 mr-2" />
                Login as Admin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hospital Login Modal */}
      {showHospitalLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Hospital Login</h2>
              <button onClick={() => setShowHospitalLogin(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleHospitalLogin}>
              <div>
                <label>Hospital Wallet Address</label>
                <input type="text" placeholder="Enter hospital wallet address" />
              </div>
              <button type="submit">
                <Hospital className="h-5 w-5 mr-2" />
                Login as Hospital
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;