// src/components/modals/TestDriveModal.jsx
import React, { useState } from 'react';
import BuyNowModal from './BuyNowModal';
import './TestDriveModal.css';

const TestDriveModal = ({ isOpen, onClose, vehicle }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
  });
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use relative URL for API call
      const response = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vehicleId: vehicle?.id || '',
          vehicleModel: vehicle?.model || ''
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert('✅ Test drive scheduled!');
        onClose();
      } else {
        alert(`❌ Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (err) {
      alert('❌ Failed to submit form. Please try again later.');
    }
  };

  const handleBuyNow = () => {
    onClose(); // Close test drive modal
    setBuyNowModalOpen(true); // Open buy now modal
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <h2>Schedule a Test Drive</h2>
          <p><strong>Model:</strong> {vehicle?.model}</p>
          <form onSubmit={handleSubmit}>
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="datetime-local" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required />
            <button type="submit">Submit Request</button>
          </form>
          
          <div className="modal-divider">
            <span>or</span>
          </div>
          
          <button className="buy-now-cta" onClick={handleBuyNow}>
            Buy This Vehicle Now
          </button>
        </div>
      </div>

      {/* Buy Now Modal */}
      <BuyNowModal
        isOpen={buyNowModalOpen}
        onClose={() => setBuyNowModalOpen(false)}
        vehicle={vehicle}
      />
    </>
  );
};

export default TestDriveModal;