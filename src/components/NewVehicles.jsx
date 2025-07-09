// src/components/NewVehicles.jsx
import React, { useState, useEffect } from 'react';
import '../styles/NewVehicles.css';

const NewVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    class: 'all',
    priceRange: 'all',
    search: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, filters]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      const data = await response.json();
      setVehicles(data);
      setFilteredVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Filter by class
    if (filters.class !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.class === filters.class);
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(vehicle => {
        const price = parseInt(vehicle.adPrice.replace(/[$,]/g, ''));
        switch (filters.priceRange) {
          case 'under40':
            return price < 40000;
          case '40to60':
            return price >= 40000 && price < 60000;
          case '60to80':
            return price >= 60000 && price < 80000;
          case 'over80':
            return price >= 80000;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter(vehicle => 
        vehicle.vehicle.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.stockNumber.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getUniqueClasses = () => {
    const classes = [...new Set(vehicles.map(v => v.class))];
    return classes.sort();
  };

  if (loading) {
    return (
      <div className="inventory-loading">
        <div className="loading-spinner"></div>
        <p>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Vehicle Inventory</h1>
        <p className="inventory-count">{filteredVehicles.length} vehicles available</p>
      </div>

      <div className="inventory-filters">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by model or stock number..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Vehicle Type</label>
          <select
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
          >
            <option value="all">All Types</option>
            {getUniqueClasses().map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Price Range</label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under40">Under $40,000</option>
            <option value="40to60">$40,000 - $60,000</option>
            <option value="60to80">$60,000 - $80,000</option>
            <option value="over80">Over $80,000</option>
          </select>
        </div>

        <button 
          className="clear-filters"
          onClick={() => setFilters({ class: 'all', priceRange: 'all', search: '' })}
        >
          Clear Filters
        </button>
      </div>

      <div className="inventory-grid">
        {filteredVehicles.length === 0 ? (
          <div className="no-results">
            <p>No vehicles match your search criteria.</p>
            <button onClick={() => setFilters({ class: 'all', priceRange: 'all', search: '' })}>
              Clear Filters
            </button>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card">
              <div className="vehicle-image">
                <img 
                  src={`https://via.placeholder.com/400x300/1976d2/ffffff?text=${encodeURIComponent(vehicle.class)}`}
                  alt={vehicle.vehicle}
                />
                <span className="stock-badge">Stock #{vehicle.stockNumber}</span>
              </div>
              
              <div className="vehicle-info">
                <h3>{vehicle.vehicle}</h3>
                <div className="vehicle-details">
                  <div className="detail-row">
                    <span className="label">Class:</span>
                    <span className="value">{vehicle.class}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">VIN:</span>
                    <span className="value vin">{vehicle.vin}</span>
                  </div>
                </div>
                
                <div className="pricing-section">
                  <div className="price-item">
                    <span className="price-label">MSRP</span>
                    <span className="price msrp">{vehicle.msrp}</span>
                  </div>
                  <div className="price-item featured">
                    <span className="price-label">Sale Price</span>
                    <span className="price sale-price">{vehicle.adPrice}</span>
                  </div>
                </div>

                {vehicle.customerIncentives && (
                  <div className="incentives">
                    <span className="incentive-icon">🎁</span>
                    {vehicle.customerIncentives}
                  </div>
                )}

                <div className="vehicle-actions">
                  <button className="btn-primary">View Details</button>
                  <button className="btn-secondary">Schedule Test Drive</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewVehicles;