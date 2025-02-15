import React, { useState } from 'react';
import { Heart, Guitar as Hospital, UserCog, ChevronRight, Shield, Users, ClipboardCheck } from 'lucide-react';
import {   MessageCircle, Star, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import './Home.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import getContract from "../utils/contract";

function Home() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showHospitalLogin, setShowHospitalLogin] = useState(false);
  const navigate = useNavigate();

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

  const loginAsHospital = async () => {
    try {
      const contract = await getContract();
      const signer = await contract.signer.getAddress();
      const isHospital = await contract.isRegisteredHospital(signer);

      if (isHospital) {
        navigate("/hospital-dashboard");
      } else {
        alert("Access Denied: You are not a registered hospital.");
      }
    } catch (error) {
      console.error("Error during hospital login:", error);
      alert("Error connecting to MetaMask: " + error.message);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    await loginAsAdmin();
  };

  const handleHospitalLogin = async (e) => {
    e.preventDefault();
    await loginAsHospital();
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Heart className="h-8 w-8 text-blue-600" />
            <span>HealthLink</span>
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
            <h1>Revolutionizing Healthcare with HealthLink</h1>
            <p>
              HealthLink is a blockchain-based platform designed to improve access to medical data and enhance security. 
              By leveraging decentralized storage and advanced encryption, we ensure that patient records are secure, 
              accessible, and up-to-date for authorized healthcare providers.
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

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="testimonials-content">
          <h2>What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <MessageCircle className="h-12 w-12 text-blue-600 mb-4" />
              <p>
                "HealthLink has transformed how we manage patient records. It's secure, efficient, and easy to use!"
              </p>
              <div className="testimonial-author">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>Dr. John Doe</span>
              </div>
            </div>
            <div className="testimonial-card">
              <MessageCircle className="h-12 w-12 text-blue-600 mb-4" />
              <p>
                "The blockchain integration ensures data integrity like never before. Highly recommended!"
              </p>
              <div className="testimonial-author">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>Jane Smith</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Heart className="h-8 w-8 text-blue-600" />
            <span>HealthLink</span>
          </div>
          <div className="footer-social">
            <a href="#"><Twitter className="h-6 w-6" /></a>
            <a href="#"><Facebook className="h-6 w-6" /></a>
            <a href="#"><Instagram className="h-6 w-6" /></a>
          </div>
          <div className="footer-newsletter">
            <p>Subscribe to our newsletter</p>
            <form>
              <input type="email" placeholder="Enter your email" />
              <button type="submit"><Mail className="h-4 w-4" /></button>
            </form>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Admin Login</h2>
              <button onClick={() => setShowAdminLogin(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleAdminLogin}>
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