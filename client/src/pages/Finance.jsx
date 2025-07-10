// src/pages/Finance.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Finance.css';

// Import all finance components
import FinanceApplicationForm from '../components/FinanceApplicationForm';
import PaymentCalculator from '../components/PaymentCalculator';
import CreditPreQual from '../components/CreditPreQual';
import FinanceSpecialOffers from '../components/FinanceSpecialOffers';
import TradeInValueEst from '../components/TradeInValueEst';
import FinanceFAQ from '../components/FinanceFAQ';

const Finance = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="finance-page">
      {/* Hero Section */}
      <section className="finance-hero">
        <div className="hero-content">
          <h1>Financing Made Easy</h1>
          <p>Get pre-approved in minutes with competitive rates and flexible terms</p>
          <button className="cta-button" onClick={() => setActiveSection('application')}>
            Start Application
          </button>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="finance-nav">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-tab ${activeSection === 'application' ? 'active' : ''}`}
            onClick={() => setActiveSection('application')}
          >
            Apply Now
          </button>
          <button 
            className={`nav-tab ${activeSection === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveSection('calculator')}
          >
            Payment Calculator
          </button>
          <button 
            className={`nav-tab ${activeSection === 'prequalify' ? 'active' : ''}`}
            onClick={() => setActiveSection('prequalify')}
          >
            Pre-Qualify
          </button>
          <button 
            className={`nav-tab ${activeSection === 'specials' ? 'active' : ''}`}
            onClick={() => setActiveSection('specials')}
          >
            Special Offers
          </button>
          <button 
            className={`nav-tab ${activeSection === 'tradein' ? 'active' : ''}`}
            onClick={() => setActiveSection('tradein')}
          >
            Trade-In
          </button>
          <button 
            className={`nav-tab ${activeSection === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveSection('faq')}
          >
            FAQ
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="finance-content">
        {activeSection === 'overview' && (
          <div className="content-section">
            <h2>Financing at Shottenkirk CDJR</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <div className="card-icon">💳</div>
                <h3>Competitive Rates</h3>
                <p>We work with multiple lenders to get you the best possible interest rates</p>
              </div>
              <div className="overview-card">
                <div className="card-icon">⚡</div>
                <h3>Quick Approval</h3>
                <p>Get pre-approved in minutes with our online application</p>
              </div>
              <div className="overview-card">
                <div className="card-icon">🤝</div>
                <h3>Flexible Terms</h3>
                <p>Choose from various loan terms to fit your budget</p>
              </div>
              <div className="overview-card">
                <div className="card-icon">🏆</div>
                <h3>All Credit Welcome</h3>
                <p>We work with all credit situations to find the right solution</p>
              </div>
            </div>

            <div className="finance-benefits">
              <h3>Why Finance with Us?</h3>
              <ul>
                <li>Over 20 lending partners to choose from</li>
                <li>Special financing offers and incentives</li>
                <li>Extended warranty options available</li>
                <li>Gap insurance protection</li>
                <li>Trade-in value applied to your loan</li>
                <li>First-time buyer programs</li>
              </ul>
            </div>

            <div className="contact-finance">
              <h3>Speak with Our Finance Team</h3>
              <p>Have questions? Our finance experts are here to help!</p>
              <div className="contact-methods">
                <a href="tel:+1234567890" className="contact-btn">
                  <span>📞</span> Call Finance
                </a>
                <a href="mailto:finance@shottenkirk.com" className="contact-btn">
                  <span>✉️</span> Email Us
                </a>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'application' && (
          <div className="content-section">
            <FinanceApplicationForm />
          </div>
        )}

        {activeSection === 'calculator' && (
          <div className="content-section">
            <PaymentCalculator />
          </div>
        )}

        {activeSection === 'prequalify' && (
          <div className="content-section">
            <CreditPreQual />
          </div>
        )}

        {activeSection === 'specials' && (
          <div className="content-section">
            <FinanceSpecialOffers />
          </div>
        )}

        {activeSection === 'tradein' && (
          <div className="content-section">
            <TradeInValueEst />
          </div>
        )}

        {activeSection === 'faq' && (
          <div className="content-section">
            <FinanceFAQ />
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;