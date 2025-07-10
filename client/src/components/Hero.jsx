// src/components/Hero.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const handleViewInventory = () => {
    navigate('/new-vehicles');
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <h1>
          Made in <span className="flag-text">America</span> with Pride
        </h1>
        <button className="hero-cta" onClick={handleViewInventory}>View Inventory</button>
      </div>
    </section>
  );
};

export default Hero;