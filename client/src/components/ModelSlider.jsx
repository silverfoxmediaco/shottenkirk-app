// src/components/ModelSlider.jsx

import React, { useState, useEffect } from 'react';
import '../styles/ModelSlider.css';

import whiteRam from '../assets/whiteramdesert.png';
import whiteJeep from '../assets/whitejeepindesert.png';
import redCharger from '../assets/redcharger.png';
import blueCherokee from '../assets/navybluejeepcherokee.png';
import bluePacifica from '../assets/bluepacifica.png';

import TestDriveModal from './modals/TestDriveModal';
import BuyNowModal from './modals/BuyNowModal'; // Add this import

const vehicles = [
  {
    image: whiteRam,
    model: '2025 Ram 1500',
    price: 'Lease From $689/mo',
    msrp: '$65,000',
    id: 'ram-1500'
  },
  {
    image: whiteJeep,
    model: '2025 Jeep Wrangler',
    price: 'Lease From $659/mo',
    msrp: '$55,000',
    id: 'jeep-wrangler'
  },
  {
    image: redCharger,
    model: '2025 Dodge Charger',
    price: 'Lease From $539/mo',
    msrp: '$45,000',
    id: 'dodge-charger'
  },
  {
    image: blueCherokee,
    model: '2025 Jeep Grand Cherokee',
    price: 'Lease From $499/mo',
    msrp: '$48,000',
    id: 'jeep-grand-cherokee'
  },
  {
    image: bluePacifica,
    model: '2025 Chrysler Pacifica',
    price: 'Lease From $475/mo',
    msrp: '$42,000',
    id: 'chrysler-pacifica'
  },
];

const ModelSlider = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Check if returning from trade-in estimator or credit application
  useEffect(() => {
    const buyNowReturn = sessionStorage.getItem('buyNowReturn');
    const vehicleData = sessionStorage.getItem('buyNowVehicle');
    const tradeInComplete = sessionStorage.getItem('buyNowTradeInComplete');
    const creditComplete = sessionStorage.getItem('buyNowCreditComplete');
    
    if ((buyNowReturn === 'true' || tradeInComplete === 'true' || creditComplete === 'true') && vehicleData) {
      const vehicle = JSON.parse(vehicleData);
      setSelectedVehicle({ ...vehicle, price: vehicle.msrp });
      setBuyNowModalOpen(true);
      
      // Clear the general return flag but keep specific data
      sessionStorage.removeItem('buyNowReturn');
    }
  }, []);

  const openTestDriveModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const openBuyNowModal = (vehicle) => {
    setSelectedVehicle({ ...vehicle, price: vehicle.msrp });
    setBuyNowModalOpen(true);
  };

  return (
    <section className="model-slider">
      <h2 className="slider-title">Explore Our Lineup</h2>
      <div className="slider-track">
        {vehicles.map((vehicle, index) => (
          <div className="slide" key={index}>
            <img src={vehicle.image} alt={vehicle.model} className="slide-image" />
            <div className="slide-content">
              <span className="vehicle-label">{vehicle.label}</span>
              <h3>{vehicle.model}</h3>
              <p className="price-range">{vehicle.price}</p>
              <div className="slide-buttons">
                <button 
                  className="buy-now"
                  onClick={() => openBuyNowModal(vehicle)}
                >
                  Buy Now
                </button>
                <button
                  className="need-financing"
                  onClick={() => openTestDriveModal(vehicle)}
                >
                  Test Drive
                </button>
              </div>
              <span className="swipe-hint">Swipe for more &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Test Drive Modal */}
      <TestDriveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={selectedVehicle}
      />

      {/* Buy Now Modal */}
      <BuyNowModal
        isOpen={buyNowModalOpen}
        onClose={() => setBuyNowModalOpen(false)}
        vehicle={selectedVehicle}
      />
    </section>
  );
};

export default ModelSlider;