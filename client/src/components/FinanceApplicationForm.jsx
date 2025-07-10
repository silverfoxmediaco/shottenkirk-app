// client/src/components/FinanceApplicationForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FinanceApplicationForm.css';

const FinanceApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleInitial: '',
    lastName: '',
    suffix: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    
    // Address Information
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    yearsAtAddress: '',
    monthsAtAddress: '',
    rentOrOwn: '',
    monthlyPayment: '',
    
    // Employment Information
    employerName: '',
    employerPhone: '',
    jobTitle: '',
    yearsEmployed: '',
    monthsEmployed: '',
    monthlyIncome: '',
    incomeType: 'salary',
    
    // Additional Income (Optional)
    additionalIncomeSource: '',
    additionalIncomeAmount: '',
    
    // Vehicle Information
    vehicleInterest: '',
    tradeIn: 'no',
    downPayment: '',
    
    // Co-Applicant
    hasCoApplicant: 'no',
    
    // Terms
    agreeTerms: false,
    agreeContact: false
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

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const formatSSN = (value) => {
    const ssn = value.replace(/\D/g, '');
    if (ssn.length <= 3) return ssn;
    if (ssn.length <= 5) return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, [e.target.name]: formatted }));
  };

  const handleSSNChange = (e) => {
    const formatted = formatSSN(e.target.value);
    setFormData(prev => ({ ...prev, ssn: formatted }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.ssn) newErrors.ssn = 'Social Security Number is required';
    if (!formData.streetAddress) newErrors.streetAddress = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.employerName) newErrors.employerName = 'Employer name is required';
    if (!formData.monthlyIncome) newErrors.monthlyIncome = 'Monthly income is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Age validation (must be 18+)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
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
      console.log('Form submitted:', formData);
      
      // If coming from BuyNowModal, store approval data and redirect back
      if (buyNowReturn) {
        const approvalData = {
          approved: true,
          apr: 4.9, // This would come from your actual credit check
          maxLoanAmount: parseInt(formData.monthlyIncome) * 15,
          monthlyIncome: formData.monthlyIncome,
          creditScore: 720 // This would come from your actual credit check
        };
        
        sessionStorage.setItem('creditApproval', JSON.stringify(approvalData));
        sessionStorage.setItem('buyNowCreditComplete', 'true');
        
        // Redirect back to the vehicle page where BuyNowModal will reopen
        navigate(-1); // Go back to previous page
      } else {
        // Normal flow - show success message
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            firstName: '',
            middleInitial: '',
            lastName: '',
            suffix: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            ssn: '',
            streetAddress: '',
            apartment: '',
            city: '',
            state: '',
            zipCode: '',
            yearsAtAddress: '',
            monthsAtAddress: '',
            rentOrOwn: '',
            monthlyPayment: '',
            employerName: '',
            employerPhone: '',
            jobTitle: '',
            yearsEmployed: '',
            monthsEmployed: '',
            monthlyIncome: '',
            incomeType: 'salary',
            additionalIncomeSource: '',
            additionalIncomeAmount: '',
            vehicleInterest: '',
            tradeIn: 'no',
            downPayment: '',
            hasCoApplicant: 'no',
            agreeTerms: false,
            agreeContact: false
          });
          setShowSuccess(false);
        }, 5000);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="finance-application-form">
      {showSuccess && !buyNowReturn && (
        <div className="success-message">
          <h3>Application Submitted Successfully!</h3>
          <p>Thank you for your application. Our finance team will review your information and contact you within 1 business day.</p>
        </div>
      )}

      {buyNowReturn && (
        <div className="buy-now-notice">
          <p>Complete this application to see your personalized rate and continue with your purchase.</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="form-section">
          <h3>Personal Information</h3>
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

            <div className="form-group small">
              <label htmlFor="middleInitial">M.I.</label>
              <input
                type="text"
                id="middleInitial"
                name="middleInitial"
                value={formData.middleInitial}
                onChange={handleChange}
                maxLength="1"
              />
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

            <div className="form-group small">
              <label htmlFor="suffix">Suffix</label>
              <select
                id="suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="Jr">Jr</option>
                <option value="Sr">Sr</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>
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
                onChange={handlePhoneChange}
                className={errors.phone ? 'error' : ''}
                placeholder="(555) 555-5555"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ssn">Social Security Number *</label>
              <input
                type="text"
                id="ssn"
                name="ssn"
                value={formData.ssn}
                onChange={handleSSNChange}
                className={errors.ssn ? 'error' : ''}
                placeholder="XXX-XX-XXXX"
              />
              {errors.ssn && <span className="error-message">{errors.ssn}</span>}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="form-section">
          <h3>Current Address</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="streetAddress">Street Address *</label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className={errors.streetAddress ? 'error' : ''}
              />
              {errors.streetAddress && <span className="error-message">{errors.streetAddress}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apartment">Apt/Suite</label>
              <input
                type="text"
                id="apartment"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'error' : ''}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <span className="error-message">{errors.state}</span>}
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
              <label htmlFor="yearsAtAddress">Years at Address</label>
              <input
                type="number"
                id="yearsAtAddress"
                name="yearsAtAddress"
                value={formData.yearsAtAddress}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthsAtAddress">Months at Address</label>
              <input
                type="number"
                id="monthsAtAddress"
                name="monthsAtAddress"
                value={formData.monthsAtAddress}
                onChange={handleChange}
                min="0"
                max="11"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rentOrOwn">Rent or Own</label>
              <select
                id="rentOrOwn"
                name="rentOrOwn"
                value={formData.rentOrOwn}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="rent">Rent</option>
                <option value="own">Own</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="monthlyPayment">Monthly Payment</label>
              <input
                type="number"
                id="monthlyPayment"
                name="monthlyPayment"
                value={formData.monthlyPayment}
                onChange={handleChange}
                placeholder="$0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="form-section">
          <h3>Employment Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="employerName">Employer Name *</label>
              <input
                type="text"
                id="employerName"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                className={errors.employerName ? 'error' : ''}
              />
              {errors.employerName && <span className="error-message">{errors.employerName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="employerPhone">Employer Phone</label>
              <input
                type="tel"
                id="employerPhone"
                name="employerPhone"
                value={formData.employerPhone}
                onChange={handlePhoneChange}
                placeholder="(555) 555-5555"
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="yearsEmployed">Years Employed</label>
              <input
                type="number"
                id="yearsEmployed"
                name="yearsEmployed"
                value={formData.yearsEmployed}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthsEmployed">Months Employed</label>
              <input
                type="number"
                id="monthsEmployed"
                name="monthsEmployed"
                value={formData.monthsEmployed}
                onChange={handleChange}
                min="0"
                max="11"
              />
            </div>

            <div className="form-group">
              <label htmlFor="monthlyIncome">Monthly Income *</label>
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

            <div className="form-group">
              <label htmlFor="incomeType">Income Type</label>
              <select
                id="incomeType"
                name="incomeType"
                value={formData.incomeType}
                onChange={handleChange}
              >
                <option value="salary">Salary</option>
                <option value="hourly">Hourly</option>
                <option value="commission">Commission</option>
                <option value="self-employed">Self-Employed</option>
                <option value="retired">Retired</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Income */}
        <div className="form-section">
          <h3>Additional Income (Optional)</h3>
          <p className="section-note">Include alimony, child support, or separate maintenance income only if you want it considered for repayment.</p>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="additionalIncomeSource">Income Source</label>
              <input
                type="text"
                id="additionalIncomeSource"
                name="additionalIncomeSource"
                value={formData.additionalIncomeSource}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="additionalIncomeAmount">Monthly Amount</label>
              <input
                type="number"
                id="additionalIncomeAmount"
                name="additionalIncomeAmount"
                value={formData.additionalIncomeAmount}
                onChange={handleChange}
                placeholder="$0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="form-section">
          <h3>Vehicle Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="vehicleInterest">Vehicle of Interest</label>
              <input
                type="text"
                id="vehicleInterest"
                name="vehicleInterest"
                value={formData.vehicleInterest}
                onChange={handleChange}
                placeholder="e.g., 2025 RAM 1500 Rebel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tradeIn">Do you have a trade-in?</label>
              <select
                id="tradeIn"
                name="tradeIn"
                value={formData.tradeIn}
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="downPayment">Down Payment Amount</label>
              <input
                type="number"
                id="downPayment"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleChange}
                placeholder="$0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Co-Applicant Option */}
        <div className="form-section">
          <h3>Co-Applicant</h3>
          <div className="form-group">
            <label htmlFor="hasCoApplicant">Add a co-applicant?</label>
            <select
              id="hasCoApplicant"
              name="hasCoApplicant"
              value={formData.hasCoApplicant}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          {formData.hasCoApplicant === 'yes' && (
            <p className="info-message">A co-applicant form will be sent to your email after submission.</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="form-section">
          <h3>Terms and Authorization</h3>
          <div className="terms-container">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms">
                I authorize Shottenkirk CDJR and its lending partners to obtain my credit report and verify the information provided. I understand that this is a credit application and that inquiries may appear on my credit report. *
              </label>
            </div>
            {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeContact"
                name="agreeContact"
                checked={formData.agreeContact}
                onChange={handleChange}
              />
              <label htmlFor="agreeContact">
                I agree to receive communications from Shottenkirk CDJR regarding my application and vehicle offers via phone, email, and text message.
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : buyNowReturn ? 'Get My Rate & Continue' : 'Submit Application'}
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
          <p className="privacy-note">
            Your information is secure and will only be used for credit evaluation purposes. 
            View our <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </div>
      </form>
    </div>
  );
};

export default FinanceApplicationForm;