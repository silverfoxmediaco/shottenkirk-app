// client/src/components/TradeInValueEst.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TradeInValueEst.css';

const TradeInValueEst = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Vehicle Information
    year: '',
    make: '',
    model: '',
    trim: '',
    mileage: '',
    vin: '',
    
    // Condition
    bodyCondition: '',
    mechanicalCondition: '',
    interiorCondition: '',
    tiresCondition: '',
    hasBeenInAccident: '',
    numberOfOwners: '',
    
    // Features
    transmission: '',
    drivetrain: '',
    fuelType: '',
    features: [],
    
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    
    // Additional Info
    oweMoney: '',
    amountOwed: '',
    readyToTrade: '',
    comments: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState(null);
  
  // Check if coming from BuyNowModal
  const [buyNowReturn, setBuyNowReturn] = useState(false);
  
  useEffect(() => {
    const buyNowState = sessionStorage.getItem('buyNowState');
    const buyNowVehicle = sessionStorage.getItem('buyNowVehicle');
    if (buyNowState && buyNowVehicle) {
      setBuyNowReturn(true);
    }
  }, []);

  // Mock data - in production, these would come from an API
  const vehicleMakes = [
    'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 
    'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 'Kia',
    'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Nissan', 'Ram', 'Subaru',
    'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const features = [
    'Leather Seats',
    'Sunroof/Moonroof',
    'Navigation System',
    'Backup Camera',
    'Bluetooth',
    'Heated Seats',
    'Remote Start',
    'Third Row Seating',
    'Apple CarPlay/Android Auto',
    'Premium Sound System',
    'Adaptive Cruise Control',
    'Blind Spot Monitoring',
    'Lane Departure Warning',
    'Parking Sensors',
    'Tow Package'
  ];

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        features: checked 
          ? [...prev.features, value]
          : prev.features.filter(f => f !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  }, []);

  const formatMileage = (value) => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleMileageBlur = useCallback((e) => {
    const formatted = formatMileage(e.target.value);
    setFormData(prev => ({ ...prev, mileage: formatted }));
  }, []);

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch(stepNumber) {
      case 1:
        if (!formData.year) newErrors.year = 'Year is required';
        if (!formData.make) newErrors.make = 'Make is required';
        if (!formData.model) newErrors.model = 'Model is required';
        if (!formData.mileage) newErrors.mileage = 'Mileage is required';
        break;
        
      case 2:
        if (!formData.bodyCondition) newErrors.bodyCondition = 'Body condition is required';
        if (!formData.mechanicalCondition) newErrors.mechanicalCondition = 'Mechanical condition is required';
        if (!formData.interiorCondition) newErrors.interiorCondition = 'Interior condition is required';
        if (!formData.tiresCondition) newErrors.tiresCondition = 'Tire condition is required';
        if (!formData.hasBeenInAccident) newErrors.hasBeenInAccident = 'Accident history is required';
        if (!formData.numberOfOwners) newErrors.numberOfOwners = 'Number of owners is required';
        break;
        
      case 3:
        if (!formData.transmission) newErrors.transmission = 'Transmission type is required';
        if (!formData.drivetrain) newErrors.drivetrain = 'Drivetrain is required';
        if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
        break;
        
      case 4:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateEstimatedValue = () => {
    // This is a simplified calculation - in production, you'd use actual market data
    let baseValue = 25000; // Base value for average vehicle
    
    // Adjust for year (depreciation)
    const age = currentYear - parseInt(formData.year);
    baseValue *= Math.pow(0.85, age); // 15% depreciation per year
    
    // Adjust for mileage
    const mileage = parseInt(formData.mileage.replace(/,/g, ''));
    const expectedMileage = age * 12000; // 12k miles per year average
    const mileageDiff = mileage - expectedMileage;
    if (mileageDiff > 0) {
      baseValue -= (mileageDiff / 1000) * 200; // $200 per 1000 miles over
    }
    
    // Adjust for condition
    const conditionMultipliers = {
      'excellent': 1.1,
      'good': 1.0,
      'fair': 0.85,
      'poor': 0.7
    };
    
    const avgCondition = (
      conditionMultipliers[formData.bodyCondition] +
      conditionMultipliers[formData.mechanicalCondition] +
      conditionMultipliers[formData.interiorCondition] +
      conditionMultipliers[formData.tiresCondition]
    ) / 4;
    
    baseValue *= avgCondition;
    
    // Adjust for accidents
    if (formData.hasBeenInAccident === 'yes') {
      baseValue *= 0.85;
    }
    
    // Adjust for features
    baseValue += formData.features.length * 200; // $200 per premium feature
    
    // Round to nearest $500
    const rounded = Math.round(baseValue / 500) * 500;
    
    // Create a range
    const lowEstimate = Math.max(rounded - 1500, 1000);
    const highEstimate = rounded + 1500;
    
    return {
      low: lowEstimate,
      high: highEstimate,
      average: rounded
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate estimated value
      const value = calculateEstimatedValue();
      setEstimatedValue(value);
      
      // If coming from BuyNowModal, store the trade-in value and redirect back
      if (buyNowReturn) {
        const tradeInData = {
          hasTradeIn: true,
          estimatedValue: value.average,
          details: {
            vehicle: `${formData.year} ${formData.make} ${formData.model}`,
            mileage: formData.mileage,
            condition: formData.bodyCondition,
            vin: formData.vin
          }
        };
        
        sessionStorage.setItem('tradeInEstimate', JSON.stringify(tradeInData));
        sessionStorage.setItem('buyNowTradeInComplete', 'true');
        
        // Redirect back to the vehicle page where BuyNowModal will reopen
        navigate(-1);
      } else {
        // Normal flow - show results
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      console.log('Trade-in submission:', formData);
      
    } catch (error) {
      console.error('Error submitting trade-in:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults && estimatedValue && !buyNowReturn) {
    return (
      <div className="tradein-results">
        <div className="results-container">
          <h2>Your Trade-In Value Estimate</h2>
          
          <div className="vehicle-summary">
            <h3>{formData.year} {formData.make} {formData.model}</h3>
            <p>{formData.mileage} miles</p>
          </div>
          
          <div className="value-display">
            <div className="value-range">
              <div className="value-item low">
                <span className="label">Low Estimate</span>
                <span className="amount">${estimatedValue.low.toLocaleString()}</span>
              </div>
              <div className="value-item average">
                <span className="label">Average Value</span>
                <span className="amount">${estimatedValue.average.toLocaleString()}</span>
              </div>
              <div className="value-item high">
                <span className="label">High Estimate</span>
                <span className="amount">${estimatedValue.high.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="results-disclaimer">
            <p>
              This is an estimated range based on the information provided. Your actual trade-in 
              value will be determined after a physical inspection of your vehicle. Factors that 
              may affect the final value include market conditions, demand, and detailed condition assessment.
            </p>
          </div>
          
          <div className="next-steps">
            <h3>Next Steps</h3>
            <ol>
              <li>A member of our team will contact you within 24 hours to discuss your trade-in</li>
              <li>Schedule an appointment for a professional appraisal</li>
              <li>Receive a firm offer that's good for 7 days</li>
              <li>Apply your trade-in value to any vehicle in our inventory</li>
            </ol>
          </div>
          
          <div className="results-actions">
            <button 
              className="primary-button" 
              onClick={() => window.location.href = '/new-vehicles'}
            >
              Browse Our Inventory
            </button>
            <button 
              className="secondary-button" 
              onClick={() => {
                setShowResults(false);
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Value Another Vehicle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tradein-estimator">
      <div className="estimator-header">
        <h2>Get Your Trade-In Value</h2>
        <p>Find out what your vehicle is worth in just a few minutes</p>
        {buyNowReturn && (
          <div className="buy-now-notice">
            <p>Complete this form to add your trade-in value to your purchase.</p>
          </div>
        )}
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
        <div className="step-indicator">
          Step {step} of 4
        </div>
      </div>

      <form onSubmit={handleSubmit} className="tradein-form">
        {step === 1 && (
          <div className="form-step">
            <h3>Vehicle Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={errors.year ? 'error' : ''}
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && <span className="error-message">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="make">Make *</label>
                <select
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className={errors.make ? 'error' : ''}
                >
                  <option value="">Select Make</option>
                  {vehicleMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
                {errors.make && <span className="error-message">{errors.make}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="model">Model *</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={errors.model ? 'error' : ''}
                  placeholder="e.g., Grand Cherokee"
                />
                {errors.model && <span className="error-message">{errors.model}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="trim">Trim Level</label>
                <input
                  type="text"
                  id="trim"
                  name="trim"
                  value={formData.trim}
                  onChange={handleChange}
                  placeholder="e.g., Limited, Sport"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mileage">Current Mileage *</label>
                <input
                  type="text"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  onBlur={handleMileageBlur}
                  className={errors.mileage ? 'error' : ''}
                  placeholder="e.g., 45,000"
                />
                {errors.mileage && <span className="error-message">{errors.mileage}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="vin">VIN (Optional)</label>
                <input
                  type="text"
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="17-character VIN for most accurate estimate"
                  maxLength="17"
                />
                <span className="field-hint">Providing VIN helps us give you a more accurate estimate</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3>Vehicle Condition</h3>
            <div className="condition-section">
              <div className="form-group">
                <label>Overall Body Condition *</label>
                <div className="radio-grid">
                  {['excellent', 'good', 'fair', 'poor'].map(condition => (
                    <label key={condition} className="radio-option">
                      <input
                        type="radio"
                        name="bodyCondition"
                        value={condition}
                        checked={formData.bodyCondition === condition}
                        onChange={handleChange}
                      />
                      <span className="radio-label">
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </span>
                      <span className="condition-desc">
                        {condition === 'excellent' && 'No dents, scratches, or rust'}
                        {condition === 'good' && 'Minor scratches or dings'}
                        {condition === 'fair' && 'Some dents, scratches, or minor rust'}
                        {condition === 'poor' && 'Major damage or extensive rust'}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.bodyCondition && <span className="error-message">{errors.bodyCondition}</span>}
              </div>

              <div className="form-group">
                <label>Mechanical Condition *</label>
                <div className="radio-grid">
                  {['excellent', 'good', 'fair', 'poor'].map(condition => (
                    <label key={condition} className="radio-option">
                      <input
                        type="radio"
                        name="mechanicalCondition"
                        value={condition}
                        checked={formData.mechanicalCondition === condition}
                        onChange={handleChange}
                      />
                      <span className="radio-label">
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </span>
                      <span className="condition-desc">
                        {condition === 'excellent' && 'Runs perfectly, no issues'}
                        {condition === 'good' && 'Runs well, minor issues'}
                        {condition === 'fair' && 'Runs, needs some work'}
                        {condition === 'poor' && 'Major mechanical issues'}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.mechanicalCondition && <span className="error-message">{errors.mechanicalCondition}</span>}
              </div>

              <div className="form-group">
                <label>Interior Condition *</label>
                <div className="radio-grid">
                  {['excellent', 'good', 'fair', 'poor'].map(condition => (
                    <label key={condition} className="radio-option">
                      <input
                        type="radio"
                        name="interiorCondition"
                        value={condition}
                        checked={formData.interiorCondition === condition}
                        onChange={handleChange}
                      />
                      <span className="radio-label">
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </span>
                      <span className="condition-desc">
                        {condition === 'excellent' && 'Like new, no wear'}
                        {condition === 'good' && 'Light wear, clean'}
                        {condition === 'fair' && 'Moderate wear, some stains'}
                        {condition === 'poor' && 'Heavy wear, tears, or damage'}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.interiorCondition && <span className="error-message">{errors.interiorCondition}</span>}
              </div>

              <div className="form-group">
                <label>Tire Condition *</label>
                <div className="radio-grid">
                  {['excellent', 'good', 'fair', 'poor'].map(condition => (
                    <label key={condition} className="radio-option">
                      <input
                        type="radio"
                        name="tiresCondition"
                        value={condition}
                        checked={formData.tiresCondition === condition}
                        onChange={handleChange}
                      />
                      <span className="radio-label">
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </span>
                      <span className="condition-desc">
                        {condition === 'excellent' && 'New or like new'}
                        {condition === 'good' && 'Good tread depth'}
                        {condition === 'fair' && 'Some tread left'}
                        {condition === 'poor' && 'Need replacement soon'}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.tiresCondition && <span className="error-message">{errors.tiresCondition}</span>}
              </div>

              <div className="form-group">
                <label>Has the vehicle been in any accidents? *</label>
                <div className="radio-inline">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="hasBeenInAccident"
                      value="yes"
                      checked={formData.hasBeenInAccident === 'yes'}
                      onChange={handleChange}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="hasBeenInAccident"
                      value="no"
                      checked={formData.hasBeenInAccident === 'no'}
                      onChange={handleChange}
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.hasBeenInAccident && <span className="error-message">{errors.hasBeenInAccident}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="numberOfOwners">Number of Previous Owners *</label>
                <select
                  id="numberOfOwners"
                  name="numberOfOwners"
                  value={formData.numberOfOwners}
                  onChange={handleChange}
                  className={errors.numberOfOwners ? 'error' : ''}
                >
                  <option value="">Select</option>
                  <option value="1">1 (Original Owner)</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4 or more</option>
                </select>
                {errors.numberOfOwners && <span className="error-message">{errors.numberOfOwners}</span>}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h3>Features & Options</h3>
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="transmission">Transmission *</label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className={errors.transmission ? 'error' : ''}
                >
                  <option value="">Select Transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                </select>
                {errors.transmission && <span className="error-message">{errors.transmission}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="drivetrain">Drivetrain *</label>
                <select
                  id="drivetrain"
                  name="drivetrain"
                  value={formData.drivetrain}
                  onChange={handleChange}
                  className={errors.drivetrain ? 'error' : ''}
                >
                  <option value="">Select Drivetrain</option>
                  <option value="fwd">Front-Wheel Drive (FWD)</option>
                  <option value="rwd">Rear-Wheel Drive (RWD)</option>
                  <option value="awd">All-Wheel Drive (AWD)</option>
                  <option value="4wd">Four-Wheel Drive (4WD)</option>
                </select>
                {errors.drivetrain && <span className="error-message">{errors.drivetrain}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="fuelType">Fuel Type *</label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className={errors.fuelType ? 'error' : ''}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                  <option value="plugin-hybrid">Plug-in Hybrid</option>
                </select>
                {errors.fuelType && <span className="error-message">{errors.fuelType}</span>}
              </div>

              <div className="form-group full-width">
                <label>Select all features that apply:</label>
                <div className="checkbox-grid">
                  {features.map(feature => (
                    <label key={feature} className="checkbox-option">
                      <input
                        type="checkbox"
                        value={feature}
                        checked={formData.features.includes(feature)}
                        onChange={handleChange}
                      />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h3>Contact Information</h3>
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

              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={errors.zipCode ? 'error' : ''}
                  maxLength="5"
                />
                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
              </div>

              <div className="form-group">
                <label>Do you still owe money on this vehicle?</label>
                <div className="radio-inline">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="oweMoney"
                      value="yes"
                      checked={formData.oweMoney === 'yes'}
                      onChange={handleChange}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="oweMoney"
                      value="no"
                      checked={formData.oweMoney === 'no'}
                      onChange={handleChange}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.oweMoney === 'yes' && (
                <div className="form-group">
                  <label htmlFor="amountOwed">Approximate Amount Owed</label>
                  <input
                    type="number"
                    id="amountOwed"
                    name="amountOwed"
                    value={formData.amountOwed}
                    onChange={handleChange}
                    placeholder="$0"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="readyToTrade">When are you looking to trade?</label>
                <select
                  id="readyToTrade"
                  name="readyToTrade"
                  value={formData.readyToTrade}
                  onChange={handleChange}
                >
                  <option value="">Select Timeframe</option>
                  <option value="immediately">Immediately</option>
                  <option value="1week">Within 1 week</option>
                  <option value="1month">Within 1 month</option>
                  <option value="3months">Within 3 months</option>
                  <option value="justlooking">Just getting a value</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="comments">Additional Comments</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Any additional information about your vehicle..."
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-navigation">
          {step > 1 && (
            <button type="button" className="back-button" onClick={handlePrevious}>
              Previous
            </button>
          )}
          
          {step < 4 ? (
            <button type="button" className="next-button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Calculating...' : buyNowReturn ? 'Add Trade-In & Continue' : 'Get My Value'}
            </button>
          )}
          
          {buyNowReturn && (
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Skip Trade-In
            </button>
          )}
        </div>
      </form>

      <div className="estimator-benefits">
        <h3>Why Trade With Us?</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">💰</span>
            <h4>Top Dollar Value</h4>
            <p>We offer competitive prices based on current market conditions</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⚡</span>
            <h4>Instant Offers</h4>
            <p>Get your value in minutes, not hours or days</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🤝</span>
            <h4>We Buy All Vehicles</h4>
            <p>Any make, model, or condition - even if you don't buy from us</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">📋</span>
            <h4>Simple Process</h4>
            <p>We handle all the paperwork and payoff details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInValueEst;