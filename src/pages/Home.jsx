import React, { useState } from 'react';
import { Heart, Guitar as Hospital, UserCog, ChevronRight, Shield, Users, ClipboardCheck, Clock } from 'lucide-react';
import { MessageCircle, Star, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import './home.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import getContract from "../utils/contract";
import MapComponent from '../components/Mapcomponent'; // Import the MapComponent
import ChatBot from '../components/chatbot'; // Import the ChatBot component
 
function Home() {

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showHospitalLogin, setShowHospitalLogin] = useState(false);
  const [showTestcenterLogin, setShowTestcenterLogin] = useState(false);
  const [showPatientLogin, setShowPatientLogin] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
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
  const loginAsPatient = async () => {
    try {
      const contract = await getContract();
      const signer = await contract.signer.getAddress();
      const isPatient = await contract.isPatientRegistered(signer); // Adjust this to check for patient
 
      if (isPatient) {
        navigate("/patient-dashboard");
      } else {
        alert("Access Denied: You are not a registered patient.");
      }
    } catch (error) {
      console.error("Error during patient login:", error);
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
 
  const loginAsTestCenter = async () => {
    try {
      const contract = await getContract();
      const signer = await contract.signer.getAddress();
      const isTestCenter = await contract.isRegisteredHospital(signer); // Adjust this to check for test center
 
      if (isTestCenter) {
        navigate("/testcenter");
      } else {
        alert("Access Denied: You are not a registered test center.");
      }
    } catch (error) {
      console.error("Error during test center login:", error);
      alert("Error connecting to MetaMask: " + error.message);
    }
  };
 
  const scrollToAboutUs = () => {
    const aboutSection = document.getElementById("about-us");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };
 
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    await loginAsAdmin();
  };
  const handlePatientLogin = async (e) => {
    e.preventDefault();
    await loginAsPatient();
  };
 
  const handleHospitalLogin = async (e) => {
    e.preventDefault();
    await loginAsHospital();
  };
 
  const handleTestCenterLogin = async (e) => {
    e.preventDefault();
    await loginAsTestCenter();
  };
 
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
 
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <img src="########" alt="HealthLink Logo" className="logo" />
            <span style={{ color: "white" }}>HealthLink</span>
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
            <button
              className="testcenter"
              onClick={() => setShowTestcenterLogin(true)}
            >
              Test Center Login
            </button>
             <button
            className="patient-login"
            onClick={() => setShowPatientLogin(true)}
            >
            Patient Login
            </button>
          </div>
        </div>
      </nav>
 
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div>
              <h1>Welcome to <span className="highlight">HealthLink!</span><br></br>Your all-in-one solution<br></br> for digital healthcare</h1>
            </div>
            <p>HealthLink is a cutting-edge blockchain-based platform designed to revolutionize healthcare by improving access to medical data while enhancing security and privacy. By leveraging decentralized storage and advanced encryption, we ensure that patient records remain tamper-proof, transparent, and accessible only to authorized healthcare providers. </p>
            <button onClick={() => scrollToAboutUs()} className="learn-more-btn">
              Learn More
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="hero-image">
            <img
              src="###########"
              alt="Healthcare"
            />
          </div>
        </div>
      </div>
 
      {/* Features Section */}
      <div className="features-section">
        <div className="features-overlay">
          <div className="features-content">
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
              <div className="feature-card">
                <Clock className="h-12 w-12 text-blue-600 mb-4" />
                <h3>24/7 Availability</h3>
                <p>
                  Access your records anytime, anywhere with round-the-clock availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <div className="nearby-hospitals">
        <h2 className="section-heading">
          Nearby <span className="highlight">Hospitals</span>
        </h2>
        <div className="hero-map">
          <MapComponent />
        </div>
      </div>
 
      {/* About Us Section */} 
      <div id="about-us" className="about-us-section">
        <h2>About Us</h2>
 
        <h3>Empowering Healthcare Through Technology</h3>
        <p>
          At <strong>HealthLink</strong>, we believe that <strong>access to accurate and secure medical records</strong> should never be a barrier to quality healthcare. 
          Our platform leverages <strong>blockchain, decentralized storage (IPFS), and smart contracts</strong> to create a <strong>seamless, tamper-proof, and highly secure</strong> system for managing patient health records. 
          By bridging the gaps in traditional healthcare data management, we empower <strong>patients, hospitals, and healthcare providers</strong> with <strong>instant, real-time access</strong> to crucial medical information—especially during emergencies.
        </p>
 
        <h3>Our Mission</h3>
        <p>
          Our mission is to <strong>revolutionize healthcare data management</strong> by ensuring:
        </p>
        <ul>
          <li><strong>✔️ Secure & Efficient Access</strong> – Eliminating paperwork, delays, and missing patient records.</li>
          <li><strong>✔️ Improved Healthcare Outcomes</strong> – Providing real-time, accurate medical data for better decision-making.</li>
          <li><strong>✔️ Privacy & Security</strong> – Protecting sensitive medical information with <strong>advanced encryption</strong> and blockchain security.</li>
          <li><strong>✔️ Seamless Patient-Provider Communication</strong> – Enabling instant data sharing for improved treatments.</li>
          <li><strong>✔️ Compliance with Healthcare Regulations</strong> – Ensuring strict adherence to <strong>GDPR, HIPAA, and other global medical standards</strong>.</li>
        </ul>
 
        <h3>Our Vision</h3>
        <p>
          We envision a <strong>connected healthcare ecosystem</strong> where patients have <strong>full control over their health data</strong>, hospitals can <strong>access real-time patient records</strong> without bureaucratic hurdles, 
          and medical professionals can <strong>collaborate seamlessly across institutions</strong> to provide better, data-driven care.
        </p>
        <p>
          Through <strong>decentralization, transparency, and security</strong>, HealthLink aims to:
        </p>
        <ul>
          <li><strong>🔹 Reduce medical errors</strong> by providing up-to-date patient histories.</li>
          <li><strong>🔹 Minimize redundant tests</strong> by ensuring data is available across hospitals and clinics.</li>
          <li><strong>🔹 Improve emergency response</strong> by granting instant access to critical medical data.</li>
          <li><strong>🔹 Promote patient empowerment</strong> by allowing individuals to manage and share their health records securely.</li>
        </ul>
 
        <h3>How HealthLink Works</h3>
        <ul>
          <li><strong>🔹 Blockchain-Based Data Integrity</strong> – Medical transactions are permanently recorded on a secure and immutable blockchain ledger.</li>
          <li><strong>🔹 Decentralized Storage (IPFS)</strong> – Patient data is stored across a global network, <strong>eliminating single points of failure</strong> and ensuring <strong>continuous availability</strong>.</li>
          <li><strong>🔹 Smart Contracts for Secure Access</strong> – Only <strong>verified healthcare providers</strong> can access or modify records, ensuring full compliance with privacy regulations.</li>
          <li><strong>🔹 Real-Time Interactive Maps</strong> – Patients can <strong>locate verified hospitals</strong>, book appointments, and receive healthcare updates instantly.</li>
          <li><strong>🔹 Emergency Access System</strong> – In <strong>critical situations</strong>, authorized medical staff can retrieve vital patient data within <strong>seconds</strong>, preventing delays in urgent treatments.</li>
        </ul>
 
        <h3>Who We Serve</h3>
        <ul>
          <li><strong>👤 Patients</strong> – Take <strong>full control</strong> of their health records, reducing paperwork and improving accessibility.</li>
          <li><strong>🏥 Hospitals & Clinics</strong> – Seamlessly <strong>retrieve, update, and share patient histories</strong> while enhancing emergency response times.</li>
          <li><strong>⚕️ Healthcare Providers</strong> – Securely access patient records, reducing administrative tasks and improving medical care.</li>
          <li><strong>🏛️ Government & Regulatory Bodies</strong> – Monitor healthcare compliance, ensure data integrity, and enforce security policies.</li>
        </ul>
 
        <h3>The Impact of HealthLink</h3>
        <ul>
          <li><strong>🌎 Global Accessibility</strong> – Patients and healthcare providers worldwide can access records securely, regardless of location.</li>
          <li><strong>💡 Innovation in Medical Data Storage</strong> – HealthLink moves away from <strong>outdated centralized systems</strong>, reducing inefficiencies.</li>
          <li><strong>📊 Improved Data Transparency</strong> – Immutable records ensure <strong>complete auditability</strong> for better healthcare governance.</li>
          <li><strong>🔐 Enhanced Patient Privacy</strong> – Advanced <strong>encryption methods</strong> keep sensitive information safe from unauthorized access.</li>
          <li><strong>⚡ Faster & Smarter Healthcare Decisions</strong> – <strong>Real-time access</strong> to medical records saves <strong>precious time</strong> in <strong>emergencies and critical care situations</strong>.</li>
        </ul>
 
        <h3>Our Commitment to the Future</h3>
        <p>
          At <strong>HealthLink</strong>, we are constantly innovating to <strong>stay ahead of emerging healthcare challenges</strong>. Our upcoming features include:
        </p>
        <ul>
          <li><strong>🔹 AI-Driven Health Insights</strong> – Offering predictive analytics for proactive patient care.</li>
          <li><strong>🔹 Telemedicine Integration</strong> – Enabling remote consultations with real-time data access.</li>
          <li><strong>🔹 Personalized Health Dashboards</strong> – Giving users deeper insights into their medical history and treatment plans.</li>
          <li><strong>🔹 Cross-Border Health Data Exchange</strong> – Ensuring medical records are accessible <strong>anywhere in the world</strong> while maintaining regulatory compliance.</li>
        </ul>
 
        <h3>Join Us in Transforming Healthcare</h3>
        <p>
          HealthLink is more than just a platform—it's a <strong>movement toward a smarter, safer, and more connected healthcare system</strong>. Our commitment to <strong>security, accessibility, and innovation</strong> makes us a <strong>pioneer in blockchain-based healthcare solutions</strong>.
        </p>
        <p><strong>🚀 Be a part of the future of healthcare. Join HealthLink today!</strong></p>
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
            <img src="####" alt="HealthLink Logo" className="logo" />
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
 
      {/* Test Center Login Modal */}
      {showTestcenterLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Test Center Login</h2>
              <button onClick={() => setShowTestcenterLogin(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleTestCenterLogin}>
              <button type="submit">
                <Hospital className="h-5 w-5 mr-2" />
                Login as Test Center
              </button>
            </form>
          </div>
        </div>
      )}
        {/* Patient Login Modal */}
    {showPatientLogin && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Patient Login</h2>
        <button onClick={() => setShowPatientLogin(false)}>×</button>
      </div>
      <form className="modal-form" onSubmit={handlePatientLogin}>
        <button type="submit">
          <UserCog className="h-5 w-5 mr-2" />
          Login as Patient
        </button>
      </form>
    </div>
  </div>
)}
 
      {/* Chatbot Toggle Button */}
      <button 
        className="chatbot-toggle"
        onClick={toggleChatbot}
      >
        <MessageCircle className="h-5 w-5" />
        {showChatbot ? "Close Assistant" : "Health Assistant"}
      </button>
 
      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="chatbot-modal">
          <div className="chatbot-container">
            <ChatBot />
          </div>
        </div>
      )}
    </div>
  );
}
 
export default Home;
