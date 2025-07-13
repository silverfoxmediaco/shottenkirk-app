// src/components/Footer.jsx

import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/onetouchauto192trans.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h2>Inventory</h2>
          <Link to="/new-vehicles">New Vehicles</Link>
          <Link to="/pre-owned">Pre-Owned</Link>
          <Link to="/specials">Specials</Link>
        </div>

        <div className="footer-section">
          <h2>Service</h2>
          <Link to="/schedule-service">Schedule Service</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-section">
          <h2>Finance</h2>
          <Link to="/finance/application">Apply For Financing</Link>
          <Link to="/finance/prequal">Pre-Qualify Now</Link>
          <Link to="/finance">Finance Hub</Link>
        </div>

        <div className="footer-section">
          <h2>About</h2>
          <Link to="/about-us">About Us</Link>
        </div>
      </div>

      <div className="footer-logo">
        <img src={logo} alt="OneTouchAuto logo" />
      </div>
    </footer>
  );
};

export default Footer;
