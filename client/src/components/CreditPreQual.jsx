// client/src/components/CreditPreQual.jsx

import React, { useState, useCallback } from 'react';
import '../styles/CreditPreQual.css';

const CreditPreQual = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2: Credit Profile
    creditRange: '',
    bankruptcyHistory: '',
    employmentStatus: '',
    monthlyIncome: '',
    
    // Step 3: Vehicle Preferences
    vehicleType: '',
    monthlyBudget: '',
    downPaymentAvailable: '',
    tradeIn: '',
    
    // Agreement
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [prequalResults, setPrequalResults] = useState(null);

  const creditRanges = [
    { value: 'excellent', label: 'Excellent (750+)', score: 750 },
    { value: 'good', label: 'Good (700-749)', score: 700 },
    { value: 'fair', label: 'Fair (650-699)', score: 650 },
    { value: 'poor', label: 'Poor (600-649)', score: 600 },
    { value: 'verypoor', label: 'Very Poor (Below 600)', score: 550 },
    { value: 'unsure', label: "I'm Not Sure", score: 0 }
  ];

  const vehicleTypes = [
    'Sedan',
    'SUV',
    'Truck',
    'Van/Minivan',
    'Not Sure Yet'
  ];

  const monthlyBudgets = [
    'Under $300',
    '$300 - $400',
    '$400 - $500',
    '$500 - $600',
    '$600 - $750',
    'Over $750'
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
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  }, []);

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch(stepNumber) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
        
      case 2:
        if (!formData.creditRange) newErrors.creditRange = 'Please select your credit range';
        if (!formData.bankruptcyHistory) newErrors.bankruptcyHistory = 'Please answer this question';
        if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
        if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required';
        break;
        
      case 3:
        if (!formData.vehicleType) newErrors.vehicleType = 'Please select a vehicle type';
        if (!formData.monthlyBudget) newErrors.monthlyBudget = 'Please select your budget';
        if (!formData.downPaymentAvailable) newErrors.downPaymentAvailable = 'Please answer this question';
        if (!formData.tradeIn) newErrors.tradeIn = 'Please answer this question';
        if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
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

  const calculatePrequalification = () => {
    const creditScore = creditRanges.find(r => r.value === formData.creditRange)?.score || 0;
    const income = parseInt(formData.monthlyIncome) || 0;
    const hasDownPayment = formData.downPaymentAvailable === 'yes';
    const hasTradeIn = formData.tradeIn === 'yes';
    const hasBankruptcy = formData.bankruptcyHistory === 'yes';
    
    // Simple qualification logic
    let status = 'declined';
    let estimatedAPR = 0;
    let maxLoanAmount = 0;
    let message = '';
    
    if (creditScore >= 700 && income >= 3000) {
      status = 'approved';
      estimatedAPR = 3.9;
      maxLoanAmount = income * 15;
      message = "Congratulations! You're pre-qualified for our best rates.";
    } else if (creditScore >= 650 && income >= 2500) {
      status = 'approved';
      estimatedAPR = 5.9;
      maxLoanAmount = income * 12;
      message = "Great news! You're pre-qualified for competitive financing.";
    } else if (creditScore >= 600 && income >= 2000 && !hasBankruptcy) {
      status = 'conditional';
      estimatedAPR = 8.9;
      maxLoanAmount = income * 10;
      message = "You may qualify for financing with specific conditions.";
    } else if (income >= 2000) {
      status = 'review';
      estimatedAPR = 12.9;
      maxLoanAmount = income * 8;
      message = "We'd like to review your application further. Special financing may be available.";
    } else {
      message = "We're unable to pre-qualify you at this time, but we have special financing programs that may help.";
    }
    
    // Bonus for down payment or trade-in
    if (hasDownPayment || hasTradeIn) {
      maxLoanAmount *= 1.1;
      if (estimatedAPR > 0) estimatedAPR -= 0.5;
    }
    
    return {
      status,
      estimatedAPR: Math.max(estimatedAPR, 0),
      maxLoanAmount: Math.round(maxLoanAmount),
      message,
      creditRange: formData.creditRange,
      monthlyBudget: formData.monthlyBudget
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate results
      const results = calculatePrequalification();
      setPrequalResults(results);
      setShowResults(true);
      
      // Here you would normally send the data to your backend
      console.log('Pre-qualification submitted:', formData);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error submitting pre-qualification:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setShowResults(false);
    setPrequalResults(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      creditRange: '',
      bankruptcyHistory: '',
      employmentStatus: '',
      monthlyIncome: '',
      vehicleType: '',
      monthlyBudget: '',
      downPaymentAvailable: '',
      tradeIn: '',
      agreeTerms: false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showResults && prequalResults) {
    return (
      <div className="prequal-results">
        <div className={`results-card ${prequalResults.status}`}>
          <div className="results-icon">
            {prequalResults.status === 'approved' && '✓'}
            {prequalResults.status === 'conditional' && '!'}
            {prequalResults.status === 'review' && '?'}
            {prequalResults.status === 'declined' && '×'}
          </div>
          
          <h2>Your Pre-Qualification Results</h2>
          <p className="results-message">{prequalResults.message}</p>
          
          {prequalResults.status !== 'declined' && (
            <div className="results-details">
              <div className="result-item">
                <span className="result-label">Estimated APR</span>
                <span className="result-value">{prequalResults.estimatedAPR.toFixed(1)}%*</span>
              </div>
              <div className="result-item">
                <span className="result-label">Max Loan Amount</span>
                <span className="result-value">${prequalResults.maxLoanAmount.toLocaleString()}*</span>
              </div>
              <div className="result-item">
                <span className="result-label">Your Budget</span>
                <span className="result-value">{prequalResults.monthlyBudget}</span>
              </div>
            </div>
          )}
          
          <div className="results-disclaimer">
            <p>* This is a soft credit check that won't affect your credit score. Final approval and rates are subject to a full credit application and verification.</p>
          </div>
          
          <div className="results-actions">
            <button className="primary-button" onClick={() => window.location.href = '/new-vehicles'}>
              View Inventory
            </button>
            <button className="secondary-button" onClick={handleStartOver}>
              Start Over
            </button>
          </div>
          
          <div className="next-steps">
            <h3>Next Steps</h3>
            <ol>
              <li>Browse our inventory to find your perfect vehicle</li>
              <li>Complete a full credit application for final approval</li>
              <li>Work with our finance team to finalize your loan</li>
              <li>Drive home in your new vehicle!</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="credit-prequal">
      <div className="prequal-header">
        <h2>Get Pre-Qualified in 60 Seconds</h2>
        <p>Check your financing options with a soft credit check that won't affect your credit score</p>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
        <div className="step-indicator">
          Step {step} of 3
        </div>
      </div>

      <form onSubmit={handleSubmit} className="prequal-form">
        {step === 1 && (
          <div className="form-step">
            <h3>Basic Information</h3>
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
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3>Credit Profile</h3>
            <div className="form-section">
              <div className="form-group">
                <label>What's your estimated credit score? *</label>
                <div className="radio-grid">
                  {creditRanges.map(range => (
                    <label key={range.value} className="radio-option">
                      <input
                        type="radio"
                        name="creditRange"
                        value={range.value}
                        checked={formData.creditRange === range.value}
                        onChange={handleChange}
                      />
                      <span className="radio-label">{range.label}</span>
                    </label>
                  ))}
                </div>
                {errors.creditRange && <span className="error-message">{errors.creditRange}</span>}
              </div>

              <div className="form-group">
                <label>Have you filed for bankruptcy in the last 7 years? *</label>
                <div className="radio-inline">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="bankruptcyHistory"
                      value="yes"
                      checked={formData.bankruptcyHistory === 'yes'}
                      onChange={handleChange}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="bankruptcyHistory"
                      value="no"
                      checked={formData.bankruptcyHistory === 'no'}
                      onChange={handleChange}
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.bankruptcyHistory && <span className="error-message">{errors.bankruptcyHistory}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="employmentStatus">Employment Status *</label>
                <select
                  id="employmentStatus"
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className={errors.employmentStatus ? 'error' : ''}
                >
                  <option value="">Select Status</option>
                  <option value="employed">Employed Full-Time</option>
                  <option value="parttime">Employed Part-Time</option>
                  <option value="selfemployed">Self-Employed</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed</option>
                </select>
                {errors.employmentStatus && <span className="error-message">{errors.employmentStatus}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="monthlyIncome">Monthly Income (before taxes) *</label>
                <input
                  type="number"
                  id="monthlyIncome"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className={errors.monthlyIncome ? 'error' : ''}
                  placeholder="$0"
                  min="0"
                />
                {errors.monthlyIncome && <span className="error-message">{errors.monthlyIncome}</span>}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h3>Vehicle Preferences</h3>
            <div className="form-section">
              <div className="form-group">
                <label>What type of vehicle are you interested in? *</label>
                <div className="radio-grid">
                  {vehicleTypes.map(type => (
                    <label key={type} className="radio-option">
                      <input
                        type="radio"
                        name="vehicleType"
                        value={type}
                        checked={formData.vehicleType === type}
                        onChange={handleChange}
                      />
                      <span className="radio-label">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.vehicleType && <span className="error-message">{errors.vehicleType}</span>}
              </div>

              <div className="form-group">
                <label>Desired monthly payment? *</label>
                <div className="radio-grid">
                  {monthlyBudgets.map(budget => (
                    <label key={budget} className="radio-option">
                      <input
                        type="radio"
                        name="monthlyBudget"
                        value={budget}
                        checked={formData.monthlyBudget === budget}
                        onChange={handleChange}
                      />
                      <span className="radio-label">{budget}</span>
                    </label>
                  ))}
                </div>
                {errors.monthlyBudget && <span className="error-message">{errors.monthlyBudget}</span>}
              </div>

              <div className="form-group">
                <label>Do you have a down payment available? *</label>
                <div className="radio-inline">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="downPaymentAvailable"
                      value="yes"
                      checked={formData.downPaymentAvailable === 'yes'}
                      onChange={handleChange}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="downPaymentAvailable"
                      value="no"
                      checked={formData.downPaymentAvailable === 'no'}
                      onChange={handleChange}
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.downPaymentAvailable && <span className="error-message">{errors.downPaymentAvailable}</span>}
              </div>

              <div className="form-group">
                <label>Do you have a vehicle to trade in? *</label>
                <div className="radio-inline">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="tradeIn"
                      value="yes"
                      checked={formData.tradeIn === 'yes'}
                      onChange={handleChange}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="tradeIn"
                      value="no"
                      checked={formData.tradeIn === 'no'}
                      onChange={handleChange}
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.tradeIn && <span className="error-message">{errors.tradeIn}</span>}
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span>
                    I understand this is a soft credit inquiry that won't affect my credit score. 
                    I authorize Shottenkirk CDJR to check my credit for pre-qualification purposes. *
                  </span>
                </label>
                {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
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
          
          {step < 3 ? (
            <button type="button" className="next-button" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Checking...' : 'Get Pre-Qualified'}
            </button>
          )}
        </div>
      </form>

      <div className="prequal-benefits">
        <h4>Why Get Pre-Qualified?</h4>
        <ul>
          <li>Know your budget before you shop</li>
          <li>No impact on your credit score</li>
          <li>Results in 60 seconds</li>
          <li>Better negotiating power</li>
          <li>Streamlined purchase process</li>
        </ul>
      </div>
    </div>
  );
};

export default CreditPreQual;