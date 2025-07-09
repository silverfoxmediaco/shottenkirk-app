// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/sklogoV2300.png';
import menuIcon from '../assets/hamburgermenu.png';
import closeIcon from '../assets/closingx.png';
import '../styles/Header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" onClick={closeMobileMenu}>
          <img src={logo} alt="Shottenkirk Logo" className="logo-img" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav nav-links">
          <Link to="/new-vehicles">New Vehicles</Link>
          <Link to="/pre-owned">Pre-Owned</Link>
          <Link to="/finance">Finance</Link>
          <Link to="/specials">Specials</Link>
          <Link to="/schedule-service">Schedule Service</Link>
          <Link to="/about-us">About Us</Link>
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
            <Link to="/new-vehicles" onClick={closeMobileMenu}>New Vehicles</Link>
            <Link to="/pre-owned" onClick={closeMobileMenu}>Pre-Owned</Link>
            <Link to="/finance" onClick={closeMobileMenu}>Finance</Link>
            <Link to="/specials" onClick={closeMobileMenu}>Specials</Link>
            <Link to="/schedule-service" onClick={closeMobileMenu}>Schedule Service</Link>
            <Link to="/about-us" onClick={closeMobileMenu}>About Us</Link>
          </div>

          <div className="mobile-backdrop" onClick={toggleMenu}></div>
        </>
      )}
    </header>
  );
};

export default Header;