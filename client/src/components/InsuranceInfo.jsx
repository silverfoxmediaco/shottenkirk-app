// client/src/components/InsuranceInfo.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InsuranceInfo.css';

const InsuranceInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Current Insurance
    hasInsurance: '',
    insuranceCompany: '',
    policyNumber: '',
    expirationDate: '',
    
    // Coverage Details
    bodilyInjuryLiability: '',
    propertyDamageLiability: '',
    collision: '',
    comprehensive: '',
    uninsuredMotorist: '',
    
    // Agent Information
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    
    // Additional Information
    currentVehicles: '',
    needNewPolicy: '',
    
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Consent
    agreeToContact: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Check if coming from BuyNowModal
  const [buyNowReturn, setBuyNowReturn] = useState(false);
  
  useEffect(() => {
    const buyNowState = sessionStorage.getItem('buyNowState');
    if (buyNowState) {
      setBuyNowReturn(true);
    }
  }, []);

  const insuranceCompanies = [
    'State Farm', 'GEICO', 'Progressive', 'Allstate', 'USAA', 
    'Liberty Mutual', 'Farmers', 'Nationwide', 'American Family',
    'Travelers', 'AAA', 'Erie Insurance', 'Auto-Owners', 'Other'
  ];

  const coverageOptions = [
    { value: '25/50', label: '$25,000/$50,000' },
    { value: '50/100', label: '$50,000/$100,000' },
    { value: '100/300', label: '$100,000/$300,000' },
    { value: '250/500', label: '$250,000/$500,000' },
    { value: '500/500', label: '$500,000/$500,000' }
  ];

  const deductibleOptions = [
    { value: '250', label: '$250' },
    { value: '500', label: '$500' },
    { value: '1000', label: '$1,000' },
    { value: '1500', label: '$1,500' },
    { value: '2000', label: '$2,000' }
  ];

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handlePhoneBlur = useCallback((e) => {
    const { name, value } = e.target;
    const formatted = formatPhone(value);
    setFormData(prev => ({ ...prev, [name]: formatted }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation based on hasInsurance
    if (!formData.hasInsurance) {
      newErrors.hasInsurance = 'Please indicate if you have current insurance';
    }
    
    if (formData.hasInsurance === 'yes') {
      if (!formData.insuranceCompany) newErrors.insuranceCompany = 'Insurance company is required';
      if (!formData.policyNumber) newErrors.policyNumber = 'Policy number is required';
      if (!formData.expirationDate) newErrors.expirationDate = 'Expiration date is required';
      if (!formData.bodilyInjuryLiability) newErrors.bodilyInjuryLiability = 'Bodily injury coverage is required';
      if (!formData.propertyDamageLiability) newErrors.propertyDamageLiability = 'Property damage coverage is required';
    }
    
    // Contact info always required
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Check expiration date is in future
    if (formData.expirationDate) {
      const expDate = new Date(formData.expirationDate);
      const today = new Date();
      if (expDate < today) {
        newErrors.expirationDate = 'Insurance appears to be expired';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally send the data to your backend
      console.log('Insurance info submitted:', formData);
      
      // If coming from BuyNowModal, store insurance data and redirect back
      if (buyNowReturn) {
        const insuranceData = {
          hasInsurance: formData.hasInsurance === 'yes',
          company: formData.insuranceCompany,
          policyNumber: formData.policyNumber,
          expirationDate: formData.expirationDate,
          isValid: true
        };
        
        sessionStorage.setItem('insuranceInfo', JSON.stringify(insuranceData));
        sessionStorage.setItem('buyNowInsuranceComplete', 'true');
        
        // Redirect back to the vehicle page where BuyNowModal will reopen
        navigate(-1);
      } else {
        // Normal flow - show success message
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            hasInsurance: '',
            insuranceCompany: '',
            policyNumber: '',
            expirationDate: '',
            bodilyInjuryLiability: '',
            propertyDamageLiability: '',
            collision: '',
            comprehensive: '',
            uninsuredMotorist: '',
            agentName: '',
            agentPhone: '',
            agentEmail: '',
            currentVehicles: '',
            needNewPolicy: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            agreeToContact: false
          });
          setShowSuccess(false);
        }, 5000);
      }
      
    } catch (error) {
      console.error('Error submitting insurance info:', error);
      alert('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="insurance-info-form">
      {showSuccess && !buyNowReturn && (
        <div className="success-message">
          <h3>Insurance Information Submitted!</h3>
          <p>Thank you for providing your insurance information. Our team will review it and contact you if we need any additional details.</p>
        </div>
      )}

      {buyNowReturn && (
        <div className="buy-now-notice">
          <p>Please provide your insurance information to continue with your purchase.</p>
        </div>
      )}

      <div className="form-header">
        <h2>Insurance Information</h2>
        <p>We need your insurance information to finalize your financing. Don't have insurance? We can help you get a quote!</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Current Insurance Status */}
        <div className="form-section">
          <h3>Current Insurance Status</h3>
          <div className="form-group">
            <label>Do you currently have auto insurance? *</label>
            <div className="radio-inline">
              <label className="radio-option">
                <input
                  type="radio"
                  name="hasInsurance"
                  value="yes"
                  checked={formData.hasInsurance === 'yes'}
                  onChange={handleChange}
                />
                <span>Yes</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="hasInsurance"
                  value="no"
                  checked={formData.hasInsurance === 'no'}
                  onChange={handleChange}
                />
                <span>No</span>
              </label>
            </div>
            {errors.hasInsurance && <span className="error-message">{errors.hasInsurance}</span>}
          </div>

          {formData.hasInsurance === 'yes' && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="insuranceCompany">Insurance Company *</label>
                  <select
                    id="insuranceCompany"
                    name="insuranceCompany"
                    value={formData.insuranceCompany}
                    onChange={handleChange}
                    className={errors.insuranceCompany ? 'error' : ''}
                  >
                    <option value="">Select Company</option>
                    {insuranceCompanies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                  {errors.insuranceCompany && <span className="error-message">{errors.insuranceCompany}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="policyNumber">Policy Number *</label>
                  <input
                    type="text"
                    id="policyNumber"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    className={errors.policyNumber ? 'error' : ''}
                    placeholder="Enter policy number"
                  />
                  {errors.policyNumber && <span className="error-message">{errors.policyNumber}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="expirationDate">Policy Expiration Date *</label>
                  <input
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    className={errors.expirationDate ? 'error' : ''}
                  />
                  {errors.expirationDate && <span className="error-message">{errors.expirationDate}</span>}
                </div>
              </div>
            </>
          )}

          {formData.hasInsurance === 'no' && (
            <div className="insurance-help-message">
              <p>No problem! We work with several insurance providers who can help you get coverage quickly.</p>
              <p>You'll need insurance before you can drive your new vehicle off the lot.</p>
            </div>
          )}
        </div>

        {/* Coverage Details - Only show if they have insurance */}
        {formData.hasInsurance === 'yes' && (
          <div className="form-section">
            <h3>Coverage Details</h3>
            <p className="section-note">Please provide your current coverage limits. This helps us ensure you meet financing requirements.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="bodilyInjuryLiability">Bodily Injury Liability *</label>
                <select
                  id="bodilyInjuryLiability"
                  name="bodilyInjuryLiability"
                  value={formData.bodilyInjuryLiability}
                  onChange={handleChange}
                  className={errors.bodilyInjuryLiability ? 'error' : ''}
                >
                  <option value="">Select Coverage</option>
                  {coverageOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.bodilyInjuryLiability && <span className="error-message">{errors.bodilyInjuryLiability}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="propertyDamageLiability">Property Damage Liability *</label>
                <select
                  id="propertyDamageLiability"
                  name="propertyDamageLiability"
                  value={formData.propertyDamageLiability}
                  onChange={handleChange}
                  className={errors.propertyDamageLiability ? 'error' : ''}
                >
                  <option value="">Select Coverage</option>
                  {coverageOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.propertyDamageLiability && <span className="error-message">{errors.propertyDamageLiability}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="collision">Collision Deductible</label>
                <select
                  id="collision"
                  name="collision"
                  value={formData.collision}
                  onChange={handleChange}
                >
                  <option value="">Select Deductible</option>
                  <option value="none">No Collision Coverage</option>
                  {deductibleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="comprehensive">Comprehensive Deductible</label>
                <select
                  id="comprehensive"
                  name="comprehensive"
                  value={formData.comprehensive}
                  onChange={handleChange}
                >
                  <option value="">Select Deductible</option>
                  <option value="none">No Comprehensive Coverage</option>
                  {deductibleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="uninsuredMotorist">Uninsured Motorist</label>
                <select
                  id="uninsuredMotorist"
                  name="uninsuredMotorist"
                  value={formData.uninsuredMotorist}
                  onChange={handleChange}
                >
                  <option value="">Select Coverage</option>
                  <option value="none">No Coverage</option>
                  {coverageOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Agent Information */}
            <h4>Insurance Agent Information (Optional)</h4>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="agentName">Agent Name</label>
                <input
                  type="text"
                  id="agentName"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleChange}
                  placeholder="Agent's full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="agentPhone">Agent Phone</label>
                <input
                  type="tel"
                  id="agentPhone"
                  name="agentPhone"
                  value={formData.agentPhone}
                  onChange={handleChange}
                  onBlur={handlePhoneBlur}
                  placeholder="(555) 555-5555"
                />
              </div>

              <div className="form-group">
                <label htmlFor="agentEmail">Agent Email</label>
                <input
                  type="email"
                  id="agentEmail"
                  name="agentEmail"
                  value={formData.agentEmail}
                  onChange={handleChange}
                  placeholder="agent@insurance.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="currentVehicles">Current Vehicles on Policy</label>
              <textarea
                id="currentVehicles"
                name="currentVehicles"
                value={formData.currentVehicles}
                onChange={handleChange}
                rows="3"
                placeholder="List year, make, and model of vehicles currently insured"
              />
            </div>

            <div className="form-group">
              <label>Will you need a new policy for this vehicle?</label>
              <div className="radio-inline">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="needNewPolicy"
                    value="yes"
                    checked={formData.needNewPolicy === 'yes'}
                    onChange={handleChange}
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="needNewPolicy"
                    value="no"
                    checked={formData.needNewPolicy === 'no'}
                    onChange={handleChange}
                  />
                  <span>No, adding to existing</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="needNewPolicy"
                    value="unsure"
                    checked={formData.needNewPolicy === 'unsure'}
                    onChange={handleChange}
                  />
                  <span>Not sure</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3>Your Contact Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handlePhoneBlur}
                className={errors.phone ? 'error' : ''}
                placeholder="(555) 555-5555"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="agreeToContact"
              name="agreeToContact"
              checked={formData.agreeToContact}
              onChange={handleChange}
            />
            <label htmlFor="agreeToContact">
              I agree to be contacted by Shottenkirk CDJR and our insurance partners regarding insurance options and quotes.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : buyNowReturn ? 'Save & Continue' : 'Submit Insurance Information'}
          </button>
          {buyNowReturn && (
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel & Return
            </button>
          )}
          {formData.hasInsurance === 'no' && (
            <button 
              type="button" 
              className="quote-button"
              onClick={() => window.open('/insurance-quotes', '_blank')}
            >
              Get Insurance Quotes
            </button>
          )}
        </div>
      </form>

      {/* Insurance Partners */}
      {formData.hasInsurance === 'no' && (
        <div className="insurance-partners">
          <h3>Our Insurance Partners</h3>
          <p>We work with trusted insurance providers to help you get coverage quickly:</p>
          <div className="partner-logos">
            {/* You would add actual partner logos here */}
            <div className="partner-item">State Farm</div>
            <div className="partner-item">Progressive</div>
            <div className="partner-item">GEICO</div>
            <div className="partner-item">Allstate</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceInfo;