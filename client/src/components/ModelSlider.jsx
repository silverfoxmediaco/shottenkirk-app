// src/components/ModelSlider.jsx

import React, { useState, useEffect } from 'react';
import '../styles/ModelSlider.css';
import { getVehicleImage } from '../utils/vehicleImages';
import TestDriveModal from './modals/TestDriveModal';
import BuyNowModal from './modals/BuyNowModal';

const ModelSlider = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real inventory vehicles
  useEffect(() => {
    fetchFeaturedVehicles();
  }, []);

  const fetchFeaturedVehicles = async () => {
    try {
      const response = await fetch('/api/inventory');
      const allVehicles = await response.json();
      
      // Get 5 random vehicles or all if less than 5
      const shuffled = [...allVehicles].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(5, allVehicles.length));
      
      // Transform the data to match what the slider expects
      const featured = selected.map(vehicle => ({
        id: vehicle._id,
        model: vehicle.vehicle,
        price: vehicle.adPrice || vehicle.msrp,
        msrp: vehicle.msrp,
        vin: vehicle.vin,
        stockNumber: vehicle.stockNumber,
        image: getVehicleImage(vehicle.vehicle),
        // Calculate a lease price estimate (rough calculation)
        leasePrice: calculateLeaseEstimate(vehicle.adPrice || vehicle.msrp)
      }));
      
      setFeaturedVehicles(featured);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
      // Fallback to some default vehicles if API fails
      setFeaturedVehicles(getDefaultVehicles());
    }
  };

  // Calculate estimated lease payment (simplified)
  const calculateLeaseEstimate = (price) => {
    const numericPrice = parseInt(price.replace(/[$,]/g, ''));
    // Rough lease calculation: ~1.5% of MSRP per month
    const leasePayment = Math.round(numericPrice * 0.015 / 10) * 10; // Round to nearest $10
    return `Lease From $${leasePayment}/mo`;
  };

  // Fallback vehicles if API fails
  const getDefaultVehicles = () => [
    {
      id: 'default-1',
      model: '2025 Ram 1500',
      price: '$65,000',
      msrp: '$65,000',
      leasePrice: 'Lease From $689/mo',
      image: '/images/2025ramrebel.png'
    },
    {
      id: 'default-2',
      model: '2025 Jeep Wrangler',
      price: '$55,000',
      msrp: '$55,000',
      leasePrice: 'Lease From $659/mo',
      image: '/images/jeepwilly.png'
    }
  ];

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

  const handleImageError = (e) => {
    e.target.src = '/images/sklogoV2300.png';
  };

  if (loading) {
    return (
      <section className="model-slider">
        <h2 className="slider-title">Explore Our Lineup</h2>
        <div className="slider-loading">
          <div className="loading-spinner"></div>
          <p>Loading featured vehicles...</p>
        </div>
      </section>
    );
  }

  if (featuredVehicles.length === 0) {
    return (
      <section className="model-slider">
        <h2 className="slider-title">Explore Our Lineup</h2>
        <div className="no-vehicles">
          <p>No vehicles available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="model-slider">
      <h2 className="slider-title">Explore Our Lineup</h2>
      <div className="slider-track">
        {featuredVehicles.map((vehicle, index) => (
          <div className="slide" key={vehicle.id}>
            <img 
              src={vehicle.image} 
              alt={vehicle.model} 
              className="slide-image"
              onError={handleImageError}
            />
            <div className="slide-content">
              <span className="stock-label">Stock #{vehicle.stockNumber}</span>
              <h3>{vehicle.model}</h3>
              <div className="price-display">
                <span className="sale-price">{vehicle.price}</span>
                {vehicle.price !== vehicle.msrp && (
                  <span className="original-price">{vehicle.msrp}</span>
                )}
              </div>
              <p className="lease-estimate">{vehicle.leasePrice}</p>
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
              {index < featuredVehicles.length - 1 && (
                <span className="swipe-hint">Swipe for more →</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Refresh button to get new random vehicles */}
      <button 
        className="refresh-featured"
        onClick={fetchFeaturedVehicles}
        title="Show different vehicles"
      >
        ↻ Show More Vehicles
      </button>

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