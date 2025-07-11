// client/src/pages/VehicleDetails.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleImage } from '../utils/vehicleImages';
import TestDriveModal from '../components/modals/TestDriveModal';
import BuyNowModal from '../components/modals/BuyNowModal';
import '../styles/VehicleDetails.css';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    availability: false,
    financing: false,
    buyNow: false
  });

  // Fetch vehicle details
  const fetchVehicleDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/inventory/${id}`);
      if (!response.ok) throw new Error('Vehicle not found');
      const data = await response.json();
      setVehicle(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicleDetails();
  }, [fetchVehicleDetails]);

  // Mock additional images - in production these would come from the database
  const getAdditionalImages = (vehicleName) => {
    const mainImage = getVehicleImage(vehicleName);
    return [
      mainImage,
      mainImage, // Placeholder - would be different angles
      mainImage, // Placeholder - would be interior shot
      mainImage, // Placeholder - would be engine shot
    ];
  };

  const images = vehicle ? getAdditionalImages(vehicle.vehicle) : [];

  // Preload images for better performance
  useEffect(() => {
    if (images.length > 0) {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [images]);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && selectedImageIndex > 0) {
        setSelectedImageIndex(selectedImageIndex - 1);
      } else if (e.key === 'ArrowRight' && selectedImageIndex < images.length - 1) {
        setSelectedImageIndex(selectedImageIndex + 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageIndex, images.length]);

  // Memoized savings calculation
  const savings = useMemo(() => {
    if (!vehicle) return 0;
    const msrp = parseInt(vehicle?.msrp?.replace(/[$,]/g, '') || '0');
    const salePrice = parseInt(vehicle?.adPrice?.replace(/[$,]/g, '') || '0') || msrp;
    return msrp - salePrice;
  }, [vehicle?.msrp, vehicle?.adPrice]);

  // Handler functions
  const handleImageError = (e) => {
    e.target.src = '/images/sklogoV2300.png';
  };

  const openTestDriveModal = () => {
    setModalOpen(true);
  };

  const handleCheckAvailability = async () => {
    setActionLoading(prev => ({ ...prev, availability: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate to contact form with vehicle info
      navigate('/contact', { 
        state: { 
          vehicle: vehicle.vehicle, 
          vin: vehicle.vin,
          subject: 'Vehicle Availability Inquiry'
        } 
      });
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, availability: false }));
    }
  };

  const handleGetFinancing = () => {
    setActionLoading(prev => ({ ...prev, financing: true }));
    // Navigate to finance application with vehicle info
    navigate('/finance/application', { 
      state: { 
        vehicleId: vehicle._id,
        vehicleModel: vehicle.vehicle,
        vehiclePrice: vehicle.adPrice || vehicle.msrp
      } 
    });
  };

  const handleBuyNow = async () => {
    setBuyNowModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle.vehicle,
        text: `Check out this ${vehicle.vehicle} at Shottenkirk!`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="loading-spinner"></div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="details-error">
        <h2>Vehicle Not Found</h2>
        <button onClick={() => navigate('/new-vehicles')}>Back to Inventory</button>
      </div>
    );
  }

  return (
    <div className="vehicle-details-container">
      {/* Header with back button */}
      <div className="details-header">
        <button className="back-button" onClick={() => navigate('/new-vehicles')}>
          ← Back to Inventory
        </button>
      </div>

      {/* Main content */}
      <div className="details-content">
        {/* Left side - Images */}
        <div className="details-gallery">
          <div className="main-image-container">
            <img 
              src={images[selectedImageIndex]}
              alt={vehicle.vehicle}
              className="main-image"
              onError={handleImageError}
            />
            <span className="stock-badge-large">Stock #{vehicle.stockNumber}</span>
          </div>
          
          <div className="thumbnail-container">
            {images.map((img, index) => (
              <div 
                key={index}
                className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img src={img} alt={`${vehicle.vehicle} view ${index + 1}`} onError={handleImageError} />
              </div>
            ))}
          </div>
          <p className="gallery-hint">Use arrow keys to navigate images</p>
        </div>

        {/* Right side - Details */}
        <div className="details-info">
          <h1 className="vehicle-title">{vehicle.vehicle}</h1>
          
          {/* Pricing Section */}
          <div className="pricing-card">
            <div className="price-row">
              <div className="price-item">
                <span className="price-label">MSRP</span>
                <span className="price msrp">{vehicle.msrp}</span>
              </div>
              {vehicle.adPrice && (
                <div className="price-item featured">
                  <span className="price-label">Sale Price</span>
                  <span className="price sale-price">{vehicle.adPrice}</span>
                </div>
              )}
            </div>
            
            {vehicle.adPrice && savings > 0 && (
              <div className="savings-banner">
                You Save: ${savings.toLocaleString()}!
              </div>
            )}

            {vehicle.customerIncentives && vehicle.customerIncentives !== "$0 " && (
              <div className="incentives-detailed">
                <span className="incentive-icon">🎁</span>
                <div>
                  <strong>Available Incentives</strong>
                  <p>{vehicle.customerIncentives}</p>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Vehicle Type</span>
              <span className="detail-value">{vehicle.class}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Stock Number</span>
              <span className="detail-value">{vehicle.stockNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">VIN</span>
              <span className="detail-value">{vehicle.vin}</span>
            </div>
            {vehicle.invoice && (
              <div className="detail-item">
                <span className="detail-label">Invoice Price</span>
                <span className="detail-value">{vehicle.invoice}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn-primary large" 
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            <button className="btn-primary large" onClick={openTestDriveModal}>
              Schedule Test Drive
            </button>
            <button 
              className="btn-secondary large" 
              onClick={handleCheckAvailability}
              disabled={actionLoading.availability}
            >
              {actionLoading.availability ? 'Checking...' : 'Check Availability'}
            </button>
            <button 
              className="btn-tertiary large" 
              onClick={handleGetFinancing}
              disabled={actionLoading.financing}
            >
              {actionLoading.financing ? 'Loading...' : 'Get Financing'}
            </button>
          </div>

          {/* Additional Actions */}
          <div className="additional-actions">
            <button className="btn-secondary large" onClick={handleShare}>
              Share This Vehicle
            </button>
            <button className="btn-secondary large" onClick={handlePrint}>
              Print Details
            </button>
          </div>

          {/* Contact Section */}
          <div className="contact-card">
            <h3>Need More Information?</h3>
            <p>Our sales team is here to help you find your perfect vehicle.</p>
            <div className="contact-methods">
              <a href={`tel:${process.env.REACT_APP_PHONE || '+1234567890'}`} className="contact-method">
                Call Us
              </a>
              <a href="#chat" className="contact-method" onClick={(e) => {
                e.preventDefault();
                // Implement chat functionality
                alert('Chat feature coming soon!');
              }}>
                Chat Now
              </a>
              <a href={`mailto:sales@shottenkirk.com?subject=Inquiry about ${vehicle.vehicle}`} className="contact-method">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section (Placeholder for future expansion) */}
      <div className="features-section">
        <h2>Features & Specifications</h2>
        <div className="features-grid">
          <div className="feature-category">
            <h3>Performance</h3>
            <ul>
              <li>Engine specifications coming soon</li>
              <li>Transmission details coming soon</li>
              <li>Fuel economy coming soon</li>
            </ul>
          </div>
          <div className="feature-category">
            <h3>Interior</h3>
            <ul>
              <li>Seating capacity coming soon</li>
              <li>Cargo space coming soon</li>
              <li>Technology features coming soon</li>
            </ul>
          </div>
          <div className="feature-category">
            <h3>Safety</h3>
            <ul>
              <li>Safety ratings coming soon</li>
              <li>Driver assistance coming soon</li>
              <li>Security features coming soon</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      <TestDriveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={{
          id: vehicle._id,
          model: vehicle.vehicle
        }}
      />

      {/* Buy Now Modal */}
      <BuyNowModal
        isOpen={buyNowModalOpen}
        onClose={() => setBuyNowModalOpen(false)}
        vehicle={{
          id: vehicle._id,
          model: vehicle.vehicle,
          price: vehicle.adPrice || vehicle.msrp,
          msrp: vehicle.msrp,
          vin: vehicle.vin,
          stockNumber: vehicle.stockNumber
        }}
      />
    </div>
  );
};

export default VehicleDetails;