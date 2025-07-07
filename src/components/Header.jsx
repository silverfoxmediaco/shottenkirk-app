// src/components/Header.jsx

import React, { useState } from 'react';
import '../styles/Header.css';
import logo from '../assets/sklogoV2300.png';
import menuIcon from '../assets/hamburgermenu.png';
import closeIcon from '../assets/closingx.png';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <img src={logo} alt="Shottenkirk Logo" className="logo-img" />

        <nav className="nav-links desktop-nav">
          <a href="#">New Vehicles</a>
          <a href="#">Pre-Owned</a>
          <a href="#">Finance</a>
          <a href="#">Specials</a>
          <a href="#">Schedule Service</a>
          <a href="#">About Us</a>
        </nav>

        <div className="mobile-menu-icon" onClick={handleToggle}>
          <img src={mobileOpen ? closeIcon : menuIcon} alt="menu toggle" />
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav">
          <a href="#">New Vehicles</a>
          <a href="#">Pre-Owned</a>
          <a href="#">Finance</a>
          <a href="#">Specials</a>
          <a href="#">Schedule Service</a>
          <a href="#">About Us</a>
        </nav>
      )}
    </header>
  );
};

export default Header;
