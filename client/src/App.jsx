// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewVehicles from './components/NewVehicles';
import VehicleDetails from './pages/VehicleDetails';
import Finance from './pages/Finance';
import FinanceApplicationForm from './components/FinanceApplicationForm';
import CreditPreQual from './components/CreditPreQual';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-vehicles" element={<NewVehicles />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/pre-owned" element={<div style={{ padding: '2rem', textAlign: 'center' }}>Pre-Owned Vehicles Coming Soon</div>} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/finance/application" element={<FinanceApplicationForm />} />
        <Route path="/finance/prequal" element={<CreditPreQual />} />
        <Route path="/specials" element={<div style={{ padding: '2rem', textAlign: 'center' }}>Specials Coming Soon</div>} />
        <Route path="/schedule-service" element={<div style={{ padding: '2rem', textAlign: 'center' }}>Schedule Service Coming Soon</div>} />
        <Route path="/about-us" element={<div style={{ padding: '2rem', textAlign: 'center' }}>About Us Coming Soon</div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
