// client/src/components/FinanceFAQ.jsx

import React, { useState } from 'react';
import '../styles/FinanceFAQ.css';

const FinanceFAQ = () => {
  const [openItems, setOpenItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData = [
    {
      id: 1,
      category: 'credit',
      question: 'What credit score do I need to qualify for financing?',
      answer: 'We work with all credit situations! While better credit scores typically qualify for lower interest rates, we have financing options available for scores ranging from 500 to 850. Our finance team works with over 20 lenders to find the best option for your situation. Even if you have challenged credit, bankruptcy, or no credit history, we have programs available to help you get approved.'
    },
    {
      id: 2,
      category: 'credit',
      question: 'Will applying for financing hurt my credit score?',
      answer: 'When you submit a credit application, it typically results in a "hard inquiry" on your credit report. However, multiple auto loan inquiries within a 14-45 day period (depending on the scoring model) are generally counted as a single inquiry for scoring purposes. This is called "rate shopping" and minimizes the impact on your credit score. Our pre-qualification tool uses a "soft inquiry" that doesn\'t affect your credit score at all.'
    },
    {
      id: 3,
      category: 'requirements',
      question: 'What documents do I need to apply for financing?',
      answer: 'To complete your financing application, you\'ll typically need: 1) Valid driver\'s license or state ID, 2) Proof of income (recent pay stubs, bank statements, or tax returns), 3) Proof of residence (utility bill or lease agreement), 4) References (personal and/or professional), 5) Down payment (if applicable), and 6) Trade-in title (if applicable). Having these documents ready can speed up the approval process.'
    },
    {
      id: 4,
      category: 'process',
      question: 'How long does the financing approval process take?',
      answer: 'Many of our customers receive approval within minutes of submitting their application! The entire process, from application to driving off the lot, can often be completed the same day. However, some situations may require additional verification, which could take 24-48 hours. We recommend applying online before visiting to expedite the process.'
    },
    {
      id: 5,
      category: 'terms',
      question: 'What loan terms are available?',
      answer: 'We offer flexible loan terms to fit your budget, typically ranging from 36 to 84 months. Shorter terms mean higher monthly payments but less interest paid overall. Longer terms offer lower monthly payments but may result in paying more interest over the life of the loan. Our finance team will help you find the right balance based on your budget and financial goals.'
    },
    {
      id: 6,
      category: 'downpayment',
      question: 'Do I need a down payment?',
      answer: 'While a down payment isn\'t always required, it\'s highly recommended. A down payment of 10-20% can: lower your monthly payments, reduce the total interest paid, improve your chances of approval, potentially qualify you for better interest rates, and help you avoid being "upside down" on your loan. We also accept trade-ins as part or all of your down payment.'
    },
    {
      id: 7,
      category: 'rates',
      question: 'What interest rates are currently available?',
      answer: 'Interest rates vary based on several factors including your credit score, loan term, down payment, and the vehicle you\'re financing. Current rates typically range from 0% APR for well-qualified buyers on select models to higher rates for challenged credit situations. Our finance team will work to get you the best rate available based on your unique situation. Check our Special Offers page for current promotional rates.'
    },
    {
      id: 8,
      category: 'process',
      question: 'Can I get pre-approved before shopping?',
      answer: 'Absolutely! Getting pre-approved is a smart way to shop with confidence. Our online pre-qualification process takes just minutes and gives you an estimate of your loan amount and terms without affecting your credit score. Pre-approval helps you: know your budget before shopping, negotiate with confidence, speed up the purchase process, and avoid disappointment. You can get pre-qualified online 24/7.'
    },
    {
      id: 9,
      category: 'special',
      question: 'Do you offer financing for first-time buyers?',
      answer: 'Yes! We have special first-time buyer programs designed to help you establish credit and get into your first vehicle. These programs typically offer: more flexible credit requirements, lower down payment options, competitive interest rates, and credit-building opportunities. You may need a co-signer depending on your credit history and income. Our finance team specializes in helping first-time buyers navigate the process.'
    },
    {
      id: 10,
      category: 'tradein',
      question: 'Can I trade in a vehicle I still owe money on?',
      answer: 'Yes, you can trade in a vehicle that still has a loan balance. This is very common! Here\'s how it works: We\'ll appraise your trade-in and determine its value. If you owe less than it\'s worth, the equity can be applied to your new purchase. If you owe more than it\'s worth (negative equity), the difference can often be rolled into your new loan. Our team will provide a transparent breakdown of your trade-in value and payoff options.'
    },
    {
      id: 11,
      category: 'special',
      question: 'What if I\'ve had a bankruptcy or repossession?',
      answer: 'We understand that financial hardships happen, and we\'re here to help you move forward. We have lenders who specialize in bankruptcy and repossession situations. Generally, you may qualify if: your bankruptcy has been discharged (Chapter 7) or you have court approval (Chapter 13), you have stable income, and you can provide a down payment. The time since your bankruptcy/repossession and steps you\'ve taken to rebuild credit will factor into approval and terms.'
    },
    {
      id: 12,
      category: 'terms',
      question: 'What\'s the difference between financing and leasing?',
      answer: 'Financing means you\'re purchasing the vehicle with a loan. You\'ll own it once the loan is paid off. Benefits include: building equity, no mileage restrictions, freedom to modify the vehicle, and the option to sell anytime. Leasing means you\'re essentially renting the vehicle for a set period. Benefits include: lower monthly payments, always driving newer models, warranty coverage, and lower upfront costs. Our team can help you determine which option best fits your needs.'
    },
    {
      id: 13,
      category: 'protection',
      question: 'What additional protection products are available?',
      answer: 'We offer several protection products to safeguard your investment: GAP Insurance (covers the difference if your vehicle is totaled and you owe more than it\'s worth), Extended Warranties (coverage beyond the manufacturer\'s warranty), Paint & Fabric Protection (protects against stains and damage), Tire & Wheel Protection (covers repair/replacement), and Credit Life & Disability Insurance (covers payments if you can\'t work). These are optional but can provide valuable peace of mind.'
    },
    {
      id: 14,
      category: 'online',
      question: 'Can I complete the entire purchase online?',
      answer: 'We offer a comprehensive online buying experience! You can: browse inventory with detailed photos and information, get pre-qualified for financing, value your trade-in, calculate payments, submit a credit application, and even start the paperwork. However, you\'ll need to visit us to: test drive your selected vehicle, finalize paperwork, complete any state-required documentation, and take delivery of your new vehicle.'
    },
    {
      id: 15,
      category: 'refinance',
      question: 'Can I refinance my auto loan later?',
      answer: 'Yes, refinancing is possible and might be beneficial if: your credit score has improved significantly, interest rates have dropped, you want to lower your monthly payment, or you want to pay off your loan faster. However, consider that refinancing may extend your loan term and increase total interest paid. There may also be fees involved. We recommend reviewing your current loan terms and consulting with our finance team to determine if refinancing makes sense for your situation.'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Questions' },
    { value: 'credit', label: 'Credit & Approval' },
    { value: 'requirements', label: 'Requirements' },
    { value: 'process', label: 'Application Process' },
    { value: 'terms', label: 'Loan Terms' },
    { value: 'rates', label: 'Interest Rates' },
    { value: 'downpayment', label: 'Down Payments' },
    { value: 'tradein', label: 'Trade-Ins' },
    { value: 'special', label: 'Special Situations' },
    { value: 'protection', label: 'Protection Products' },
    { value: 'online', label: 'Online Services' },
    { value: 'refinance', label: 'Refinancing' }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenItems(filteredFAQs.map(faq => faq.id));
  };

  const collapseAll = () => {
    setOpenItems([]);
  };

  // Filter FAQs based on search term and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="finance-faq">
      <div className="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about auto financing</p>
      </div>

      <div className="faq-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="expand-controls">
          <button onClick={expandAll} className="expand-btn">
            Expand All
          </button>
          <button onClick={collapseAll} className="collapse-btn">
            Collapse All
          </button>
        </div>
      </div>

      {filteredFAQs.length === 0 ? (
        <div className="no-results">
          <p>No questions found matching your search.</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="faq-list">
          {filteredFAQs.map(faq => (
            <div 
              key={faq.id} 
              className={`faq-item ${openItems.includes(faq.id) ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleItem(faq.id)}
                aria-expanded={openItems.includes(faq.id)}
              >
                <span className="question-text">{faq.question}</span>
                <span className="toggle-icon">
                  {openItems.includes(faq.id) ? '−' : '+'}
                </span>
              </button>
              
              {openItems.includes(faq.id) && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="faq-contact">
        <h3>Still Have Questions?</h3>
        <p>Our finance experts are here to help you understand your options and find the best solution for your needs.</p>
        <div className="contact-options">
          <a href="tel:+1234567890" className="contact-btn phone">
            <span className="icon">📞</span>
            <div>
              <strong>Call Us</strong>
              <span>(123) 456-7890</span>
            </div>
          </a>
          <a href="#" className="contact-btn chat">
            <span className="icon">💬</span>
            <div>
              <strong>Live Chat</strong>
              <span>Available Now</span>
            </div>
          </a>
          <a href="mailto:finance@shottenkirk.com" className="contact-btn email">
            <span className="icon">✉️</span>
            <div>
              <strong>Email Us</strong>
              <span>finance@shottenkirk.com</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FinanceFAQ;