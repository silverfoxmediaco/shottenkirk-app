// src/components/Footer.jsx

import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/Shottenkirk192.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h2>Inventory</h2>
          <a href="#">New Vehicles</a>
          <a href="#">Pre-Owned</a>
          <a href="#">Specials</a>
        </div>

        <div className="footer-section">
          <h2>Service</h2>
          <a href="#">Schedule Service</a>
          <a href="#">Contact Us</a>
        </div>

        <div className="footer-section">
          <h2>Finance</h2>
          <a href="#">Apply For Financing</a>
          <a href="#">Value Your Trade</a>
          <a href="#">Payment Calculator</a>
        </div>

        <div className="footer-section">
          <h2>About</h2>
          <a href="#">About Us</a>
          <a href="#">Finance</a>
        </div>
      </div>

      <div className="footer-logo">
        <img src={logo} alt="Shottenkirk logo" />
      </div>
    </footer>
  );
};

export default Footer;
