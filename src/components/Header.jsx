// src/components/Header.jsx

import React, { useState } from 'react';
import logo from '../assets/sklogoV2300.png';
import menuIcon from '../assets/hamburgermenu.png';
import closeIcon from '../assets/closingx.png';
import '../styles/Header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <img src={logo} alt="Shottenkirk Logo" className="logo-img" />

        {/* Desktop Navigation */}
        <nav className="desktop-nav nav-links">
          <a href="#">New Vehicles</a>
          <a href="#">Pre-Owned</a>
          <a href="#">Finance</a>
          <a href="#">Specials</a>
          <a href="#">Schedule Service</a>
          <a href="#">About Us</a>
        </nav>

        {/* Mobile Menu Toggle Icon */}
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          <img src={mobileOpen ? closeIcon : menuIcon} alt="Menu Toggle" />
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      {mobileOpen && (
        <>
          <div className="mobile-nav slide-in nav-links">
            <a href="#">New Vehicles</a>
            <a href="#">Pre-Owned</a>
            <a href="#">Finance</a>
            <a href="#">Specials</a>
            <a href="#">Schedule Service</a>
            <a href="#">About Us</a>
          </div>

          <div className="mobile-backdrop" onClick={toggleMenu}></div>
        </>
      )}
    </header>
  );
};

export default Header;
