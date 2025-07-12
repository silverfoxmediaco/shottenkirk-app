// client/src/components/PaymentCalculator.jsx

import React, { useState, useEffect, useCallback } from 'react';
import '../styles/PaymentCalculator.css';

const PaymentCalculator = () => {
  // Store display values (formatted)
  const [formData, setFormData] = useState({
    vehiclePrice: '35,000',
    downPayment: '5,000',
    tradeInValue: '0',
    interestRate: 5.9,
    loanTerm: 60,
    salesTax: 6.25,
    includeFeesAndTaxes: true,
    estimatedFees: '500'
  });

  // Store raw numeric values for calculations
  const [rawValues, setRawValues] = useState({
    vehiclePrice: 35000,
    downPayment: 5000,
    tradeInValue: 0,
    estimatedFees: 500
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    loanAmount: 0,
    taxAmount: 0,
    totalFinanced: 0
  });

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [errors, setErrors] = useState({});

  // Common loan terms
  const loanTermOptions = [
    { value: 36, label: '36 months (3 years)' },
    { value: 48, label: '48 months (4 years)' },
    { value: 60, label: '60 months (5 years)' },
    { value: 72, label: '72 months (6 years)' },
    { value: 84, label: '84 months (7 years)' }
  ];

  // Calculate payment whenever form data changes
  useEffect(() => {
    calculatePayment();
  }, [rawValues, formData.interestRate, formData.loanTerm, formData.salesTax, formData.includeFeesAndTaxes]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (['vehiclePrice', 'downPayment', 'tradeInValue', 'estimatedFees'].includes(name)) {
      // For currency inputs, store the raw value
      const numericValue = parseInt(value.replace(/[$,]/g, '') || '0');
      setRawValues(prev => ({ ...prev, [name]: numericValue }));
      // Store the display value as-is
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      // For other inputs (interest rate, loan term, etc.)
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Format currency fields on blur
  const handleCurrencyBlur = useCallback((e) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value.replace(/[$,]/g, '') || '0');
    const formatted = formatNumber(numericValue);
    setFormData(prev => ({ ...prev, [name]: formatted }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (rawValues.vehiclePrice <= 0) {
      newErrors.vehiclePrice = 'Vehicle price must be greater than 0';
    }
    
    if (rawValues.downPayment < 0) {
      newErrors.downPayment = 'Down payment cannot be negative';
    }
    
    if (rawValues.downPayment >= rawValues.vehiclePrice) {
      newErrors.downPayment = 'Down payment must be less than vehicle price';
    }
    
    const interestRate = parseFloat(formData.interestRate);
    if (interestRate < 0 || interestRate > 30) {
      newErrors.interestRate = 'Interest rate must be between 0% and 30%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePayment = () => {
    if (!validateForm()) return;

    const price = rawValues.vehiclePrice;
    const down = rawValues.downPayment;
    const tradeIn = rawValues.tradeInValue;
    const rate = parseFloat(formData.interestRate) || 0;
    const term = parseInt(formData.loanTerm) || 60;
    const taxRate = parseFloat(formData.salesTax) || 0;
    const fees = formData.includeFeesAndTaxes ? rawValues.estimatedFees : 0;

    // Calculate tax amount
    const taxableAmount = price - tradeIn;
    const taxAmount = formData.includeFeesAndTaxes ? (taxableAmount * taxRate / 100) : 0;

    // Calculate loan amount
    const loanAmount = price - down - tradeIn + taxAmount + fees;

    if (loanAmount <= 0) {
      setResults({
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        loanAmount: 0,
        taxAmount: 0,
        totalFinanced: loanAmount
      });
      return;
    }

    // Calculate monthly payment
    let monthlyPayment;
    if (rate === 0) {
      // If no interest, simple division
      monthlyPayment = loanAmount / term;
    } else {
      // Standard auto loan calculation
      const monthlyRate = rate / 100 / 12;
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    }

    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - loanAmount;

    setResults({
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      loanAmount: Math.round(loanAmount),
      taxAmount: Math.round(taxAmount),
      totalFinanced: Math.round(loanAmount)
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setFormData({
      vehiclePrice: '35,000',
      downPayment: '5,000',
      tradeInValue: '0',
      interestRate: 5.9,
      loanTerm: 60,
      salesTax: 6.25,
      includeFeesAndTaxes: true,
      estimatedFees: '500'
    });
    setRawValues({
      vehiclePrice: 35000,
      downPayment: 5000,
      tradeInValue: 0,
      estimatedFees: 500
    });
    setShowBreakdown(false);
  };

  return (
    <div className="payment-calculator">
      <div className="calculator-container">
        <div className="calculator-form">
          <h3>Loan Details</h3>
          
          <div className="form-group">
            <label htmlFor="vehiclePrice">Vehicle Price</label>
            <div className="input-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="text"
                id="vehiclePrice"
                name="vehiclePrice"
                value={formData.vehiclePrice}
                onChange={handleChange}
                onBlur={handleCurrencyBlur}
                className={errors.vehiclePrice ? 'error' : ''}
              />
            </div>
            {errors.vehiclePrice && <span className="error-message">{errors.vehiclePrice}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="downPayment">Down Payment</label>
            <div className="input-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="text"
                id="downPayment"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleChange}
                onBlur={handleCurrencyBlur}
                className={errors.downPayment ? 'error' : ''}
              />
            </div>
            {errors.downPayment && <span className="error-message">{errors.downPayment}</span>}
            <span className="field-hint">
              {((rawValues.downPayment / rawValues.vehiclePrice) * 100).toFixed(1)}% of vehicle price
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="tradeInValue">Trade-In Value</label>
            <div className="input-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="text"
                id="tradeInValue"
                name="tradeInValue"
                value={formData.tradeInValue}
                onChange={handleChange}
                onBlur={handleCurrencyBlur}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="interestRate">Interest Rate (APR)</label>
            <div className="input-wrapper">
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="30"
                className={errors.interestRate ? 'error' : ''}
              />
              <span className="input-suffix">%</span>
            </div>
            {errors.interestRate && <span className="error-message">{errors.interestRate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="loanTerm">Loan Term</label>
            <select
              id="loanTerm"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleChange}
            >
              {loanTermOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-separator"></div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="includeFeesAndTaxes"
                checked={formData.includeFeesAndTaxes}
                onChange={handleChange}
              />
              Include taxes and fees in calculation
            </label>
          </div>

          {formData.includeFeesAndTaxes && (
            <>
              <div className="form-group">
                <label htmlFor="salesTax">Sales Tax Rate</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="salesTax"
                    name="salesTax"
                    value={formData.salesTax}
                    onChange={handleChange}
                    step="0.25"
                    min="0"
                    max="15"
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="estimatedFees">Estimated Fees</label>
                <div className="input-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    type="text"
                    id="estimatedFees"
                    name="estimatedFees"
                    value={formData.estimatedFees}
                    onChange={handleChange}
                    onBlur={handleCurrencyBlur}
                  />
                </div>
                <span className="field-hint">Title, registration, doc fees, etc.</span>
              </div>
            </>
          )}

          <div className="form-actions">
            <button className="reset-button" onClick={handleReset}>
              Reset Calculator
            </button>
          </div>
        </div>

        <div className="calculator-results">
          <div className="results-header">
            <h3>Your Estimated Payment</h3>
            <button className="print-button" onClick={handlePrint}>
              Print Results
            </button>
          </div>

          <div className="monthly-payment-display">
            <span className="payment-label">Monthly Payment</span>
            <span className="payment-amount">{formatCurrency(results.monthlyPayment)}</span>
            <span className="payment-term">for {formData.loanTerm} months</span>
          </div>

          <div className="results-summary">
            <div className="summary-row">
              <span>Vehicle Price:</span>
              <span>{formatCurrency(rawValues.vehiclePrice)}</span>
            </div>
            <div className="summary-row">
              <span>Down Payment:</span>
              <span>-{formatCurrency(rawValues.downPayment)}</span>
            </div>
            {rawValues.tradeInValue > 0 && (
              <div className="summary-row">
                <span>Trade-In Value:</span>
                <span>-{formatCurrency(rawValues.tradeInValue)}</span>
              </div>
            )}
            {formData.includeFeesAndTaxes && (
              <>
                <div className="summary-row">
                  <span>Sales Tax:</span>
                  <span>+{formatCurrency(results.taxAmount)}</span>
                </div>
                <div className="summary-row">
                  <span>Fees:</span>
                  <span>+{formatCurrency(rawValues.estimatedFees)}</span>
                </div>
              </>
            )}
            <div className="summary-row total">
              <span>Amount Financed:</span>
              <span>{formatCurrency(results.loanAmount)}</span>
            </div>
          </div>

          <button 
            className="breakdown-toggle"
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            {showBreakdown ? 'Hide' : 'Show'} Full Breakdown
          </button>

          {showBreakdown && (
            <div className="payment-breakdown">
              <h4>Payment Breakdown</h4>
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <span className="breakdown-label">Total of Payments</span>
                  <span className="breakdown-value">{formatCurrency(results.totalPayment)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Total Interest</span>
                  <span className="breakdown-value">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">APR</span>
                  <span className="breakdown-value">{formData.interestRate}%</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Loan Term</span>
                  <span className="breakdown-value">{formData.loanTerm} months</span>
                </div>
              </div>
            </div>
          )}

          <div className="calculator-disclaimer">
            <p>
              * This is an estimate for informational purposes only. Actual payment may vary based on 
              credit approval, final vehicle price, applicable incentives, and dealer fees. Contact our 
              finance team for accurate pricing and available rates.
            </p>
          </div>

          <div className="calculator-cta">
            <h4>Ready to Get Started?</h4>
            <p>Our finance team can help you get approved quickly!</p>
            <div className="cta-buttons">
              <button className="apply-button">Apply for Financing</button>
              <button className="contact-button">Contact Finance Team</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCalculator;