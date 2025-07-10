// src/components/modals/BuyNowModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyNowModal.css';

const BuyNowModal = ({ isOpen, onClose, vehicle }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('overview'); // overview, trade-in, financing, build-deal, customer-info, delivery, confirmation
  const [dealData, setDealData] = useState({
    vehicle: null,
    tradeIn: {
      hasTradeIn: null,
      estimatedValue: 0,
      details: null
    },
    financing: {
      method: null, // cash, finance, lease
      preApprovalData: null,
      monthlyPayment: 0,
      term: 60,
      apr: 5.9,
      downPayment: 0
    },
    addOns: {
      protectionPlan: null,
      accessories: [],
      maintenancePlan: null
    },
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      streetAddress: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      driversLicense: '',
      dateOfBirth: ''
    },
    delivery: {
      method: null, // pickup, delivery
      scheduledDate: null,
      location: null
    }
  });

  const [customerInfoErrors, setCustomerInfoErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  // Protection plans
  const protectionPlans = [
    { id: 'basic', name: 'Basic Coverage', term: '3 years/36,000 miles', price: 995 },
    { id: 'premium', name: 'Premium Coverage', term: '5 years/60,000 miles', price: 1795 },
    { id: 'ultimate', name: 'Ultimate Coverage', term: '7 years/100,000 miles', price: 2995 }
  ];

  // Accessories based on vehicle type
  const accessories = [
    { id: 'floor-mats', name: 'All-Weather Floor Mats', price: 195 },
    { id: 'cargo-liner', name: 'Cargo Liner', price: 149 },
    { id: 'running-boards', name: 'Running Boards', price: 599 },
    { id: 'bed-cover', name: 'Tonneau Cover', price: 899 },
    { id: 'tow-hitch', name: 'Tow Hitch Package', price: 495 },
    { id: 'roof-rack', name: 'Roof Rack System', price: 449 },
    { id: 'window-tint', name: 'Window Tinting', price: 299 },
    { id: 'paint-protection', name: 'Paint Protection Film', price: 1299 }
  ];

  // Maintenance plans
  const maintenancePlans = [
    { id: 'basic-maint', name: 'Basic Maintenance', term: '3 years', price: 595 },
    { id: 'full-maint', name: 'Full Maintenance', term: '5 years', price: 1495 }
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  useEffect(() => {
    if (isOpen && vehicle) {
      setDealData(prev => ({
        ...prev,
        vehicle: {
          ...vehicle,
          price: parseInt(vehicle.price?.replace(/[$,]/g, '')) || parseInt(vehicle.msrp?.replace(/[$,]/g, '')) || 50000
        }
      }));
    }
  }, [isOpen, vehicle]);

  useEffect(() => {
    // Check if returning from trade-in estimator
    const tradeInComplete = sessionStorage.getItem('buyNowTradeInComplete');
    const tradeInData = sessionStorage.getItem('tradeInEstimate');
    const buyNowState = sessionStorage.getItem('buyNowState');
    
    if (tradeInComplete === 'true' && tradeInData && buyNowState) {
      const tradeIn = JSON.parse(tradeInData);
      const savedState = JSON.parse(buyNowState);
      
      // Update the deal data with trade-in value
      setDealData(prev => ({
        ...savedState,
        tradeIn: tradeIn
      }));
      
      // Move to financing step
      setCurrentStep('financing');
      
      // Clear session storage
      sessionStorage.removeItem('buyNowTradeInComplete');
      sessionStorage.removeItem('tradeInEstimate');
      sessionStorage.removeItem('buyNowState');
      
      // Show success notification
      setTimeout(() => {
        alert(`✅ Trade-in value added: $${tradeIn.estimatedValue.toLocaleString()}`);
      }, 500);
    }
    
    // Also check for credit application returns
    const creditComplete = sessionStorage.getItem('buyNowCreditComplete');
    const creditApproval = sessionStorage.getItem('creditApproval');
    
    if (creditComplete === 'true' && creditApproval && buyNowState) {
      const approval = JSON.parse(creditApproval);
      const savedState = JSON.parse(buyNowState);
      
      // Update the deal data with credit approval
      setDealData(prev => ({
        ...savedState,
        financing: {
          ...savedState.financing,
          preApprovalData: approval,
          apr: approval.apr,
          monthlyPayment: 0 // Will be recalculated
        }
      }));
      
      // Set the current step
      setCurrentStep('build-deal'); // Move to next step after financing
      
      // Clear session storage
      sessionStorage.removeItem('buyNowCreditComplete');
      sessionStorage.removeItem('creditApproval');
      sessionStorage.removeItem('buyNowState');
      
      // Show success notification
      setTimeout(() => {
        alert(`✅ Great news! You're approved at ${approval.apr}% APR!`);
      }, 500);
    }
  }, [isOpen]);

  // Calculate total and monthly payment
  const calculateDeal = () => {
    const vehiclePrice = dealData.vehicle?.price || 0;
    const tradeInValue = dealData.tradeIn.estimatedValue || 0;
    const downPayment = dealData.financing.downPayment || 0;
    
    // Add-ons total
    const protectionCost = dealData.addOns.protectionPlan?.price || 0;
    const accessoriesCost = dealData.addOns.accessories.reduce((sum, acc) => sum + acc.price, 0);
    const maintenanceCost = dealData.addOns.maintenancePlan?.price || 0;
    const addOnsTotal = protectionCost + accessoriesCost + maintenanceCost;
    
    // Taxes and fees
    const subtotal = vehiclePrice + addOnsTotal - tradeInValue;
    const taxRate = 0.0625; // 6.25%
    const taxes = subtotal * taxRate;
    const docFee = 599;
    const registrationFee = 225;
    
    const totalPrice = subtotal + taxes + docFee + registrationFee;
    const amountToFinance = totalPrice - downPayment;
    
    // Calculate monthly payment
    let monthlyPayment = 0;
    if (dealData.financing.method === 'finance' || dealData.financing.method === 'lease') {
      const apr = dealData.financing.apr / 100;
      const monthlyRate = apr / 12;
      const term = dealData.financing.term;
      
      if (dealData.financing.method === 'finance') {
        monthlyPayment = amountToFinance * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
      } else {
        // Simplified lease calculation
        const residualValue = vehiclePrice * 0.55; // 55% residual
        const depreciation = (vehiclePrice - residualValue) / term;
        const financeCharge = (vehiclePrice + residualValue) * monthlyRate;
        monthlyPayment = depreciation + financeCharge;
      }
    }
    
    return {
      vehiclePrice,
      tradeInValue,
      downPayment,
      addOnsTotal,
      protectionCost,
      accessoriesCost,
      maintenanceCost,
      subtotal,
      taxes,
      docFee,
      registrationFee,
      totalPrice,
      amountToFinance,
      monthlyPayment: Math.round(monthlyPayment)
    };
  };

  const calculations = calculateDeal();

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'phone') {
      formattedValue = formatPhone(value);
    }
    
    setDealData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [name]: formattedValue
      }
    }));
    
    // Clear error for this field
    if (customerInfoErrors[name]) {
      setCustomerInfoErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCustomerInfo = () => {
    const errors = {};
    const { customerInfo } = dealData;
    
    if (!customerInfo.firstName) errors.firstName = 'First name is required';
    if (!customerInfo.lastName) errors.lastName = 'Last name is required';
    if (!customerInfo.email) errors.email = 'Email is required';
    if (!customerInfo.phone) errors.phone = 'Phone number is required';
    if (!customerInfo.streetAddress) errors.streetAddress = 'Street address is required';
    if (!customerInfo.city) errors.city = 'City is required';
    if (!customerInfo.state) errors.state = 'State is required';
    if (!customerInfo.zipCode) errors.zipCode = 'ZIP code is required';
    if (!customerInfo.driversLicense) errors.driversLicense = "Driver's license is required";
    if (!customerInfo.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerInfo.email && !emailRegex.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Age validation (must be 18+)
    if (customerInfo.dateOfBirth) {
      const birthDate = new Date(customerInfo.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        errors.dateOfBirth = 'You must be at least 18 years old';
      }
    }
    
    setCustomerInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCompletePurchase = async () => {
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions to complete your purchase.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to process purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally send all the deal data to your backend
      const purchaseData = {
        ...dealData,
        calculations,
        purchaseDate: new Date().toISOString(),
        dealNumber: `SK${Date.now()}`
      };
      
      console.log('Purchase completed:', purchaseData);
      
      // Show success
      setPurchaseComplete(true);
      
      // Clear all session storage
      sessionStorage.clear();
      
    } catch (error) {
      console.error('Error completing purchase:', error);
      alert('There was an error processing your purchase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step Components
  const OverviewStep = () => (
    <div className="step-content overview-step">
      <div className="vehicle-showcase">
        <h2>{vehicle?.model}</h2>
        <div className="price-display">
          <span className="price-label">Starting at</span>
          <span className="price-amount">${dealData.vehicle?.price?.toLocaleString()}</span>
        </div>
        <div className="key-features">
          <div className="feature">✓ No-Haggle Pricing</div>
          <div className="feature">✓ 7-Day Return Policy</div>
          <div className="feature">✓ Free Home Delivery Available</div>
        </div>
      </div>
      <button className="continue-btn" onClick={() => setCurrentStep('trade-in')}>
        Start Building Your Deal
      </button>
    </div>
  );

  const TradeInStep = () => (
    <div className="step-content trade-in-step">
      <h3>Do you have a vehicle to trade in?</h3>
      <div className="trade-in-options">
        <button 
          className={`option-card ${dealData.tradeIn.hasTradeIn === true ? 'selected' : ''}`}
          onClick={() => {
            setDealData(prev => ({ ...prev, tradeIn: { ...prev.tradeIn, hasTradeIn: true }}));
            // Store modal state and redirect to trade-in estimator
            sessionStorage.setItem('buyNowState', JSON.stringify({ ...dealData, currentStep: 'trade-in' }));
            sessionStorage.setItem('buyNowVehicle', JSON.stringify(vehicle));
            navigate('/trade-in-estimator');
            onClose();
          }}
        >
          <span className="option-icon">🚗</span>
          <span className="option-title">Yes, I have a trade-in</span>
          <span className="option-desc">Get an instant estimate</span>
        </button>
        <button 
          className={`option-card ${dealData.tradeIn.hasTradeIn === false ? 'selected' : ''}`}
          onClick={() => {
            setDealData(prev => ({ ...prev, tradeIn: { ...prev.tradeIn, hasTradeIn: false }}));
            setCurrentStep('financing');
          }}
        >
          <span className="option-icon">❌</span>
          <span className="option-title">No trade-in</span>
        </button>
      </div>
      {dealData.tradeIn.estimatedValue > 0 && (
        <div className="trade-in-summary">
          <p>Estimated Trade-In Value: <strong>${dealData.tradeIn.estimatedValue.toLocaleString()}</strong></p>
        </div>
      )}
    </div>
  );

  const FinancingStep = () => (
    <div className="step-content financing-step">
      <h3>How would you like to pay?</h3>
      
      {dealData.financing.preApprovalData && (
        <div className="approval-banner">
          <span className="approval-icon">✅</span>
          <div>
            <h4>You're Pre-Approved!</h4>
            <p>Rate: {dealData.financing.preApprovalData.apr}% APR</p>
            <p>Max Loan: ${dealData.financing.preApprovalData.maxLoanAmount.toLocaleString()}</p>
          </div>
        </div>
      )}
      
      <div className="financing-options">
        <button 
          className={`option-card ${dealData.financing.method === 'cash' ? 'selected' : ''}`}
          onClick={() => {
            setDealData(prev => ({ ...prev, financing: { ...prev.financing, method: 'cash' }}));
            setCurrentStep('build-deal');
          }}
        >
          <span className="option-icon">💵</span>
          <span className="option-title">Cash</span>
          <span className="option-desc">Pay in full</span>
        </button>
        <button 
          className={`option-card ${dealData.financing.method === 'finance' ? 'selected' : ''}`}
          onClick={() => {
            setDealData(prev => ({ ...prev, financing: { ...prev.financing, method: 'finance' }}));
          }}
        >
          <span className="option-icon">🏦</span>
          <span className="option-title">Finance</span>
          <span className="option-desc">Get pre-approved in 60 seconds</span>
        </button>
        <button 
          className={`option-card ${dealData.financing.method === 'lease' ? 'selected' : ''}`}
          onClick={() => {
            setDealData(prev => ({ ...prev, financing: { ...prev.financing, method: 'lease' }}));
          }}
        >
          <span className="option-icon">📋</span>
          <span className="option-title">Lease</span>
          <span className="option-desc">Lower monthly payments</span>
        </button>
      </div>
      
      {(dealData.financing.method === 'finance' || dealData.financing.method === 'lease') && (
        <div className="financing-details">
          <div className="soft-credit-check">
            <h4>Get Pre-Approved - No Impact to Credit Score</h4>
            <p>See your real rate and payment with a soft credit check</p>
            <button 
              className="pre-approval-btn"
              onClick={() => {
                // Redirect to credit pre-qual or show inline form
                sessionStorage.setItem('buyNowState', JSON.stringify({ ...dealData, currentStep: 'financing' }));
                navigate('/credit-prequal');
                onClose();
              }}
            >
              Check My Rate
            </button>
            <button 
              className="skip-btn"
              onClick={() => setCurrentStep('build-deal')}
            >
              Skip for Now
            </button>
          </div>
          
          <div className="financing-calculator">
            <h4>Payment Calculator</h4>
            <div className="calc-inputs">
              <div className="input-group">
                <label>Down Payment</label>
                <input 
                  type="number" 
                  value={dealData.financing.downPayment}
                  onChange={(e) => setDealData(prev => ({ 
                    ...prev, 
                    financing: { ...prev.financing, downPayment: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div className="input-group">
                <label>Term (months)</label>
                <select 
                  value={dealData.financing.term}
                  onChange={(e) => setDealData(prev => ({ 
                    ...prev, 
                    financing: { ...prev.financing, term: parseInt(e.target.value) }
                  }))}
                >
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                  <option value="72">72 months</option>
                  <option value="84">84 months</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {dealData.financing.method && (
        <button className="continue-btn" onClick={() => setCurrentStep('build-deal')}>
          Continue to Build Your Deal
        </button>
      )}
    </div>
  );

  const BuildDealStep = () => (
    <div className="step-content build-deal-step">
      <h3>Build Your Deal</h3>
      
      <div className="deal-builder">
        <div className="builder-section">
          <h4>Protection Plans</h4>
          <div className="protection-options">
            {protectionPlans.map(plan => (
              <div 
                key={plan.id}
                className={`add-on-card ${dealData.addOns.protectionPlan?.id === plan.id ? 'selected' : ''}`}
                onClick={() => setDealData(prev => ({ 
                  ...prev, 
                  addOns: { ...prev.addOns, protectionPlan: plan }
                }))}
              >
                <h5>{plan.name}</h5>
                <p>{plan.term}</p>
                <p className="price">${plan.price}</p>
              </div>
            ))}
            <div 
              className={`add-on-card ${dealData.addOns.protectionPlan === null ? 'selected' : ''}`}
              onClick={() => setDealData(prev => ({ 
                ...prev, 
                addOns: { ...prev.addOns, protectionPlan: null }
              }))}
            >
              <h5>No Protection Plan</h5>
            </div>
          </div>
        </div>

        <div className="builder-section">
          <h4>Popular Accessories</h4>
          <div className="accessories-grid">
            {accessories.map(acc => (
              <label key={acc.id} className="accessory-item">
                <input 
                  type="checkbox"
                  checked={dealData.addOns.accessories.some(a => a.id === acc.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setDealData(prev => ({ 
                        ...prev, 
                        addOns: { ...prev.addOns, accessories: [...prev.addOns.accessories, acc] }
                      }));
                    } else {
                      setDealData(prev => ({ 
                        ...prev, 
                        addOns: { ...prev.addOns, accessories: prev.addOns.accessories.filter(a => a.id !== acc.id) }
                      }));
                    }
                  }}
                />
                <span className="accessory-name">{acc.name}</span>
                <span className="accessory-price">${acc.price}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="builder-section">
          <h4>Maintenance Plans</h4>
          <div className="maintenance-options">
            {maintenancePlans.map(plan => (
              <div 
                key={plan.id}
                className={`add-on-card ${dealData.addOns.maintenancePlan?.id === plan.id ? 'selected' : ''}`}
                onClick={() => setDealData(prev => ({ 
                  ...prev, 
                  addOns: { ...prev.addOns, maintenancePlan: plan }
                }))}
              >
                <h5>{plan.name}</h5>
                <p>{plan.term}</p>
                <p className="price">${plan.price}</p>
              </div>
            ))}
            <div 
              className={`add-on-card ${dealData.addOns.maintenancePlan === null ? 'selected' : ''}`}
              onClick={() => setDealData(prev => ({ 
                ...prev, 
                addOns: { ...prev.addOns, maintenancePlan: null }
              }))}
            >
              <h5>No Maintenance Plan</h5>
            </div>
          </div>
        </div>
      </div>

      <button className="continue-btn" onClick={() => setCurrentStep('customer-info')}>
        Continue to Your Information
      </button>
    </div>
  );

  const CustomerInfoStep = () => (
    <div className="step-content customer-info-step">
      <h3>Your Information</h3>
      
      <div className="customer-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={dealData.customerInfo.firstName}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.firstName ? 'error' : ''}
            />
            {customerInfoErrors.firstName && <span className="error-message">{customerInfoErrors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={dealData.customerInfo.lastName}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.lastName ? 'error' : ''}
            />
            {customerInfoErrors.lastName && <span className="error-message">{customerInfoErrors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={dealData.customerInfo.email}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.email ? 'error' : ''}
            />
            {customerInfoErrors.email && <span className="error-message">{customerInfoErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={dealData.customerInfo.phone}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.phone ? 'error' : ''}
              placeholder="(555) 555-5555"
            />
            {customerInfoErrors.phone && <span className="error-message">{customerInfoErrors.phone}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="streetAddress">Street Address *</label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={dealData.customerInfo.streetAddress}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.streetAddress ? 'error' : ''}
            />
            {customerInfoErrors.streetAddress && <span className="error-message">{customerInfoErrors.streetAddress}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="apartment">Apt/Suite</label>
            <input
              type="text"
              id="apartment"
              name="apartment"
              value={dealData.customerInfo.apartment}
              onChange={handleCustomerInfoChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={dealData.customerInfo.city}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.city ? 'error' : ''}
            />
            {customerInfoErrors.city && <span className="error-message">{customerInfoErrors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <select
              id="state"
              name="state"
              value={dealData.customerInfo.state}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.state ? 'error' : ''}
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {customerInfoErrors.state && <span className="error-message">{customerInfoErrors.state}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code *</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={dealData.customerInfo.zipCode}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.zipCode ? 'error' : ''}
              maxLength="5"
            />
            {customerInfoErrors.zipCode && <span className="error-message">{customerInfoErrors.zipCode}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="driversLicense">Driver's License # *</label>
            <input
              type="text"
              id="driversLicense"
              name="driversLicense"
              value={dealData.customerInfo.driversLicense}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.driversLicense ? 'error' : ''}
            />
            {customerInfoErrors.driversLicense && <span className="error-message">{customerInfoErrors.driversLicense}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth *</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={dealData.customerInfo.dateOfBirth}
              onChange={handleCustomerInfoChange}
              className={customerInfoErrors.dateOfBirth ? 'error' : ''}
            />
            {customerInfoErrors.dateOfBirth && <span className="error-message">{customerInfoErrors.dateOfBirth}</span>}
          </div>
        </div>
      </div>

      <button 
        className="continue-btn" 
        onClick={() => {
          if (validateCustomerInfo()) {
            setCurrentStep('delivery');
          }
        }}
      >
        Continue to Delivery Options
      </button>
    </div>
  );

  const DeliveryStep = () => (
    <div className="step-content delivery-step">
      <h3>How would you like to receive your vehicle?</h3>
      <div className="delivery-options">
        <button 
          className={`option-card ${dealData.delivery.method === 'pickup' ? 'selected' : ''}`}
          onClick={() => setDealData(prev => ({ 
            ...prev, 
            delivery: { ...prev.delivery, method: 'pickup' }
          }))}
        >
          <span className="option-icon">🏢</span>
          <span className="option-title">Pickup at Dealership</span>
          <span className="option-desc">Available as soon as tomorrow</span>
        </button>
        <button 
          className={`option-card ${dealData.delivery.method === 'delivery' ? 'selected' : ''}`}
          onClick={() => setDealData(prev => ({ 
            ...prev, 
            delivery: { ...prev.delivery, method: 'delivery' }
          }))}
        >
          <span className="option-icon">🚚</span>
          <span className="option-title">Home Delivery</span>
          <span className="option-desc">Free delivery within 50 miles</span>
        </button>
      </div>

      {dealData.delivery.method && (
        <div className="scheduling-section">
          <h4>Select Your Preferred Date</h4>
          <input 
            type="date" 
            min={new Date().toISOString().split('T')[0]}
            value={dealData.delivery.scheduledDate || ''}
            onChange={(e) => setDealData(prev => ({ 
              ...prev, 
              delivery: { ...prev.delivery, scheduledDate: e.target.value }
            }))}
          />
        </div>
      )}

      {dealData.delivery.method && dealData.delivery.scheduledDate && (
        <button className="complete-btn" onClick={() => setCurrentStep('confirmation')}>
          Review Your Purchase
        </button>
      )}
    </div>
  );

  const ConfirmationStep = () => (
    <div className="step-content confirmation-step">
      <h3>Review and Confirm Your Purchase</h3>
      
      <div className="purchase-summary">
        <div className="summary-section">
          <h4>Vehicle Details</h4>
          <div className="summary-item">
            <span className="label">Vehicle:</span>
            <span className="value">{vehicle?.model}</span>
          </div>
          <div className="summary-item">
            <span className="label">Stock #:</span>
            <span className="value">{vehicle?.id}</span>
          </div>
        </div>

        <div className="summary-section">
          <h4>Customer Information</h4>
          <div className="summary-item">
            <span className="label">Name:</span>
            <span className="value">{dealData.customerInfo.firstName} {dealData.customerInfo.lastName}</span>
          </div>
          <div className="summary-item">
            <span className="label">Email:</span>
            <span className="value">{dealData.customerInfo.email}</span>
          </div>
          <div className="summary-item">
            <span className="label">Phone:</span>
            <span className="value">{dealData.customerInfo.phone}</span>
          </div>
          <div className="summary-item">
            <span className="label">Address:</span>
            <span className="value">
              {dealData.customerInfo.streetAddress} {dealData.customerInfo.apartment}<br />
              {dealData.customerInfo.city}, {dealData.customerInfo.state} {dealData.customerInfo.zipCode}
            </span>
          </div>
        </div>

        <div className="summary-section">
          <h4>Financing</h4>
          <div className="summary-item">
            <span className="label">Payment Method:</span>
            <span className="value">{dealData.financing.method?.charAt(0).toUpperCase() + dealData.financing.method?.slice(1)}</span>
          </div>
          {(dealData.financing.method === 'finance' || dealData.financing.method === 'lease') && (
            <>
              <div className="summary-item">
                <span className="label">Term:</span>
                <span className="value">{dealData.financing.term} months</span>
              </div>
              <div className="summary-item">
                <span className="label">APR:</span>
                <span className="value">{dealData.financing.apr}%</span>
              </div>
            </>
          )}
        </div>

        <div className="summary-section">
          <h4>Delivery</h4>
          <div className="summary-item">
            <span className="label">Method:</span>
            <span className="value">{dealData.delivery.method === 'pickup' ? 'Dealership Pickup' : 'Home Delivery'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Date:</span>
            <span className="value">{new Date(dealData.delivery.scheduledDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="summary-section pricing-summary">
          <h4>Pricing Summary</h4>
          <div className="summary-item">
            <span className="label">Vehicle Price:</span>
            <span className="value">${calculations.vehiclePrice.toLocaleString()}</span>
          </div>
          {calculations.tradeInValue > 0 && (
            <div className="summary-item trade-in">
              <span className="label">Trade-In Value:</span>
              <span className="value">-${calculations.tradeInValue.toLocaleString()}</span>
            </div>
          )}
          {calculations.addOnsTotal > 0 && (
            <div className="summary-item">
              <span className="label">Add-Ons Total:</span>
              <span className="value">${calculations.addOnsTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="summary-item">
            <span className="label">Sales Tax:</span>
            <span className="value">${calculations.taxes.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="label">Fees:</span>
            <span className="value">${(calculations.docFee + calculations.registrationFee).toLocaleString()}</span>
          </div>
          {calculations.downPayment > 0 && (
            <div className="summary-item">
              <span className="label">Down Payment:</span>
              <span className="value">-${calculations.downPayment.toLocaleString()}</span>
            </div>
          )}
          <div className="summary-item total">
            <span className="label">Total {dealData.financing.method === 'cash' ? 'Price' : 'Amount to Finance'}:</span>
            <span className="value">${dealData.financing.method === 'cash' ? calculations.totalPrice.toLocaleString() : calculations.amountToFinance.toLocaleString()}</span>
          </div>
          {calculations.monthlyPayment > 0 && (
            <div className="summary-item monthly">
              <span className="label">Estimated Monthly Payment:</span>
              <span className="value">${calculations.monthlyPayment}/mo</span>
            </div>
          )}
        </div>
      </div>

      <div className="terms-section">
        <label className="terms-checkbox">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
          />
          <span>
            I agree to the terms and conditions of this purchase. I understand that this is a binding agreement
            and that a Shottenkirk representative will contact me to finalize the details of my purchase.
          </span>
        </label>
      </div>

      <button 
        className={`confirm-purchase-btn ${!agreeToTerms ? 'disabled' : ''}`}
        onClick={handleCompletePurchase}
        disabled={!agreeToTerms || isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Complete Purchase'}
      </button>
    </div>
  );

  const PurchaseCompleteStep = () => (
    <div className="step-content purchase-complete-step">
      <div className="success-icon">✅</div>
      <h2>Purchase Complete!</h2>
      <p className="success-message">
        Thank you for your purchase! Your deal number is <strong>#{`SK${Date.now()}`}</strong>
      </p>
      
      <div className="next-steps-card">
        <h3>What Happens Next</h3>
        <ol>
          <li>You'll receive a confirmation email shortly</li>
          <li>A sales specialist will contact you within 1 hour during business hours</li>
          <li>We'll finalize your financing and paperwork</li>
          <li>Your vehicle will be ready on {new Date(dealData.delivery.scheduledDate).toLocaleDateString()}</li>
        </ol>
      </div>
      
      <div className="contact-info">
        <p>Questions? Call us at <strong>(555) 123-4567</strong></p>
      </div>
      
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );

  // Progress indicator
  const steps = ['overview', 'trade-in', 'financing', 'build-deal', 'customer-info', 'delivery', 'confirmation'];
  const currentStepIndex = steps.indexOf(currentStep);

  if (!isOpen) return null;

  return (
    <div className="buy-now-modal-overlay" onClick={onClose}>
      <div className="buy-now-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>×</button>
          {currentStep !== 'overview' && !purchaseComplete && (
            <div className="progress-indicator">
              {steps.slice(1).map((step, index) => (
                <div 
                  key={step} 
                  className={`progress-step ${index + 1 <= currentStepIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="modal-body">
          <div className="left-panel">
            {purchaseComplete ? (
              <PurchaseCompleteStep />
            ) : (
              <>
                {currentStep === 'overview' && <OverviewStep />}
                {currentStep === 'trade-in' && <TradeInStep />}
                {currentStep === 'financing' && <FinancingStep />}
                {currentStep === 'build-deal' && <BuildDealStep />}
                {currentStep === 'customer-info' && <CustomerInfoStep />}
                {currentStep === 'delivery' && <DeliveryStep />}
                {currentStep === 'confirmation' && <ConfirmationStep />}
                
                {currentStep !== 'overview' && currentStepIndex > 0 && !purchaseComplete && (
                  <button 
                    className="back-btn" 
                    onClick={() => setCurrentStep(steps[currentStepIndex - 1])}
                  >
                    ← Back
                  </button>
                )}
              </>
            )}
          </div>

          {currentStep !== 'overview' && !purchaseComplete && (
            <div className="right-panel">
              <div className="deal-summary">
                <h4>Your Deal Summary</h4>
                
                <div className="summary-lines">
                  <div className="line-item">
                    <span>Vehicle Price</span>
                    <span>${calculations.vehiclePrice.toLocaleString()}</span>
                  </div>
                  
                  {calculations.tradeInValue > 0 && (
                    <div className="line-item trade-in">
                      <span>Trade-In Value</span>
                      <span>-${calculations.tradeInValue.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {calculations.addOnsTotal > 0 && (
                    <>
                      {calculations.protectionCost > 0 && (
                        <div className="line-item">
                          <span>Protection Plan</span>
                          <span>${calculations.protectionCost.toLocaleString()}</span>
                        </div>
                      )}
                      {calculations.accessoriesCost > 0 && (
                        <div className="line-item">
                          <span>Accessories</span>
                          <span>${calculations.accessoriesCost.toLocaleString()}</span>
                        </div>
                      )}
                      {calculations.maintenanceCost > 0 && (
                        <div className="line-item">
                          <span>Maintenance Plan</span>
                          <span>${calculations.maintenanceCost.toLocaleString()}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="divider"></div>
                  
                  <div className="line-item">
                    <span>Subtotal</span>
                    <span>${calculations.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="line-item">
                    <span>Sales Tax</span>
                    <span>${calculations.taxes.toLocaleString()}</span>
                  </div>
                  
                  <div className="line-item">
                    <span>Doc & Registration Fees</span>
                    <span>${(calculations.docFee + calculations.registrationFee).toLocaleString()}</span>
                  </div>
                  
                  {calculations.downPayment > 0 && (
                    <div className="line-item">
                      <span>Down Payment</span>
                      <span>-${calculations.downPayment.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="divider"></div>
                  
                  <div className="line-item total">
                    <span>Total {dealData.financing.method === 'cash' ? 'Price' : 'Amount to Finance'}</span>
                    <span>${dealData.financing.method === 'cash' ? calculations.totalPrice.toLocaleString() : calculations.amountToFinance.toLocaleString()}</span>
                  </div>
                </div>
                
                {(dealData.financing.method === 'finance' || dealData.financing.method === 'lease') && calculations.monthlyPayment > 0 && (
                  <div className="monthly-payment-display">
                    <span className="payment-label">Estimated Monthly Payment</span>
                    <span className="payment-amount">${calculations.monthlyPayment}/mo</span>
                    <span className="payment-term">for {dealData.financing.term} months</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;