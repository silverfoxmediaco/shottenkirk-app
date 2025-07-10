// src/components/modals/BuyNowModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyNowModal.css';

const BuyNowModal = ({ isOpen, onClose, vehicle }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('overview'); // overview, trade-in, financing, build-deal, delivery
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
    delivery: {
      method: null, // pickup, delivery
      scheduledDate: null,
      location: null
    }
  });

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

      <button className="continue-btn" onClick={() => setCurrentStep('delivery')}>
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
        <button className="complete-btn" onClick={() => console.log('Complete purchase', dealData)}>
          Complete Your Purchase
        </button>
      )}
    </div>
  );

  // Progress indicator
  const steps = ['overview', 'trade-in', 'financing', 'build-deal', 'delivery'];
  const currentStepIndex = steps.indexOf(currentStep);

  if (!isOpen) return null;

  return (
    <div className="buy-now-modal-overlay" onClick={onClose}>
      <div className="buy-now-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>×</button>
          {currentStep !== 'overview' && (
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
            {currentStep === 'overview' && <OverviewStep />}
            {currentStep === 'trade-in' && <TradeInStep />}
            {currentStep === 'financing' && <FinancingStep />}
            {currentStep === 'build-deal' && <BuildDealStep />}
            {currentStep === 'delivery' && <DeliveryStep />}
            
            {currentStep !== 'overview' && currentStepIndex > 0 && (
              <button 
                className="back-btn" 
                onClick={() => setCurrentStep(steps[currentStepIndex - 1])}
              >
                ← Back
              </button>
            )}
          </div>

          {currentStep !== 'overview' && (
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