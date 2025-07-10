// client/src/components/FinanceSpecialOffers.jsx

import React, { useState, useEffect } from 'react';
import '../styles/FinanceSpecialOffers.css';

const FinanceSpecialOffers = () => {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [offers, setOffers] = useState([]);

  // Mock data for special offers - in production this would come from your backend
  const specialOffers = [
    {
      id: 1,
      brand: 'Ram',
      model: '1500',
      type: 'apr',
      headline: '0% APR for 72 Months',
      subheadline: 'Plus $1,000 Bonus Cash',
      details: [
        'Well-qualified buyers',
        'On select 2025 Ram 1500 models',
        'Cannot be combined with other offers'
      ],
      disclaimer: 'With approved credit through Chrysler Capital',
      expirationDate: '2025-01-31',
      featured: true
    },
    {
      id: 2,
      brand: 'Jeep',
      model: 'Grand Cherokee',
      type: 'cash',
      headline: '$3,500 Cash Allowance',
      subheadline: 'On 2025 Grand Cherokee Models',
      details: [
        'Available on most trims',
        'Can be combined with special financing',
        'Limited time offer'
      ],
      disclaimer: 'See dealer for complete details',
      expirationDate: '2025-01-31',
      featured: true
    },
    {
      id: 3,
      brand: 'Dodge',
      model: 'Durango',
      type: 'apr',
      headline: '1.9% APR for 60 Months',
      subheadline: 'Low APR Financing Available',
      details: [
        'Well-qualified buyers',
        'On select 2025 Durango models',
        'In lieu of cash allowance'
      ],
      disclaimer: 'Through Chrysler Capital',
      expirationDate: '2025-01-31',
      featured: false
    },
    {
      id: 4,
      brand: 'Chrysler',
      model: 'Pacifica',
      type: 'lease',
      headline: 'Lease for $399/month',
      subheadline: '36 Months, $3,999 Due at Signing',
      details: [
        '10,000 miles per year',
        'Well-qualified lessees',
        'Touring L model'
      ],
      disclaimer: 'Plus tax, title, and fees',
      expirationDate: '2025-01-31',
      featured: false
    },
    {
      id: 5,
      brand: 'Ram',
      model: '2500',
      type: 'cash',
      headline: '$2,000 Bonus Cash',
      subheadline: 'Plus No Payments for 90 Days',
      details: [
        'On select 2025 Ram 2500 models',
        'Deferred payment option available',
        'With approved credit'
      ],
      disclaimer: 'Interest accrues from date of purchase',
      expirationDate: '2025-01-31',
      featured: false
    },
    {
      id: 6,
      brand: 'Jeep',
      model: 'Wrangler',
      type: 'loyalty',
      headline: '$500 Loyalty Bonus',
      subheadline: 'For Current Jeep Owners',
      details: [
        'Must currently own or lease a Jeep',
        'Stackable with other offers',
        'Proof of ownership required'
      ],
      disclaimer: 'See dealer for eligibility',
      expirationDate: '2025-01-31',
      featured: false
    },
    {
      id: 7,
      brand: 'all',
      model: 'Various',
      type: 'military',
      headline: '$500 Military Appreciation',
      subheadline: 'For Active & Veteran Military',
      details: [
        'Active, retired, and veteran military',
        'Spouses also eligible',
        'Valid military ID required'
      ],
      disclaimer: 'Cannot be combined with employee pricing',
      expirationDate: '2025-12-31',
      featured: false
    },
    {
      id: 8,
      brand: 'all',
      model: 'Various',
      type: 'college',
      headline: '$400 College Grad Bonus',
      subheadline: 'Recent College Graduates',
      details: [
        'Graduated within last 2 years',
        'Or will graduate within 6 months',
        'Proof of graduation required'
      ],
      disclaimer: 'With approved credit',
      expirationDate: '2025-12-31',
      featured: false
    },
    {
      id: 9,
      brand: 'all',
      model: 'Various',
      type: 'firstresponder',
      headline: '$500 First Responder Bonus',
      subheadline: 'Police, Fire, EMT, Healthcare',
      details: [
        'Active first responders',
        'Healthcare workers included',
        'Valid employment ID required'
      ],
      disclaimer: 'Stackable with select offers',
      expirationDate: '2025-12-31',
      featured: false
    }
  ];

  useEffect(() => {
    // Filter offers based on selected brand and type
    let filteredOffers = specialOffers;

    if (selectedBrand !== 'all') {
      filteredOffers = filteredOffers.filter(
        offer => offer.brand === selectedBrand || offer.brand === 'all'
      );
    }

    if (selectedType !== 'all') {
      filteredOffers = filteredOffers.filter(offer => offer.type === selectedType);
    }

    // Sort by featured first, then by id
    filteredOffers.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.id - b.id;
    });

    setOffers(filteredOffers);
  }, [selectedBrand, selectedType]);

  const getOfferIcon = (type) => {
    switch (type) {
      case 'apr': return '%';
      case 'cash': return '$';
      case 'lease': return '📋';
      case 'loyalty': return '🤝';
      case 'military': return '🎖️';
      case 'college': return '🎓';
      case 'firstresponder': return '🚨';
      default: return '🎁';
    }
  };

  const getOfferTypeLabel = (type) => {
    switch (type) {
      case 'apr': return 'APR Special';
      case 'cash': return 'Cash Back';
      case 'lease': return 'Lease Deal';
      case 'loyalty': return 'Loyalty';
      case 'military': return 'Military';
      case 'college': return 'College Grad';
      case 'firstresponder': return 'First Responder';
      default: return 'Special Offer';
    }
  };

  const getDaysRemaining = (expirationDate) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="finance-special-offers">
      <div className="offers-header">
        <h2>Current Special Offers</h2>
        <p>Take advantage of these limited-time financing deals and incentives</p>
      </div>

      <div className="offers-filters">
        <div className="filter-group">
          <label>Brand</label>
          <select 
            value={selectedBrand} 
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="all">All Brands</option>
            <option value="Chrysler">Chrysler</option>
            <option value="Dodge">Dodge</option>
            <option value="Jeep">Jeep</option>
            <option value="Ram">Ram</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Offer Type</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="apr">APR Specials</option>
            <option value="cash">Cash Back</option>
            <option value="lease">Lease Deals</option>
            <option value="loyalty">Loyalty Programs</option>
            <option value="military">Military</option>
            <option value="college">College Grad</option>
            <option value="firstresponder">First Responder</option>
          </select>
        </div>
      </div>

      <div className="offers-grid">
        {offers.length === 0 ? (
          <div className="no-offers">
            <p>No offers match your selected filters.</p>
            <button onClick={() => { setSelectedBrand('all'); setSelectedType('all'); }}>
              View All Offers
            </button>
          </div>
        ) : (
          offers.map(offer => {
            const daysRemaining = getDaysRemaining(offer.expirationDate);
            const isExpiringSoon = daysRemaining <= 7;

            return (
              <div 
                key={offer.id} 
                className={`offer-card ${offer.featured ? 'featured' : ''}`}
              >
                {offer.featured && <span className="featured-badge">Featured Offer</span>}
                
                <div className="offer-header">
                  <div className="offer-icon">{getOfferIcon(offer.type)}</div>
                  <div className="offer-brand-info">
                    <span className="offer-type">{getOfferTypeLabel(offer.type)}</span>
                    <h3>{offer.brand !== 'all' ? `${offer.brand} ${offer.model}` : offer.model}</h3>
                  </div>
                </div>

                <div className="offer-content">
                  <h4 className="offer-headline">{offer.headline}</h4>
                  <p className="offer-subheadline">{offer.subheadline}</p>

                  <ul className="offer-details">
                    {offer.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>

                  <p className="offer-disclaimer">{offer.disclaimer}</p>

                  <div className="offer-footer">
                    <div className={`expiration ${isExpiringSoon ? 'expiring-soon' : ''}`}>
                      {isExpiringSoon ? (
                        <span className="urgent">Expires in {daysRemaining} days!</span>
                      ) : (
                        <span>Valid through {new Date(offer.expirationDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    <button className="view-inventory-btn">
                      View Eligible Vehicles
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="offers-disclaimer">
        <h3>Important Information</h3>
        <ul>
          <li>All offers require approved credit through Chrysler Capital or other approved lenders</li>
          <li>Not all buyers will qualify for lowest rates</li>
          <li>Offers cannot be combined unless specifically stated</li>
          <li>See dealer for complete details and eligibility requirements</li>
          <li>Offers valid on in-stock vehicles only and subject to availability</li>
          <li>Prices exclude tax, title, license, and dealer fees</li>
        </ul>
      </div>

      <div className="offers-cta">
        <h3>Ready to Save?</h3>
        <p>Our finance team can help you take advantage of these special offers</p>
        <div className="cta-buttons">
          <button className="primary-cta">Get Pre-Qualified</button>
          <button className="secondary-cta">Contact Finance Team</button>
        </div>
      </div>
    </div>
  );
};

export default FinanceSpecialOffers;