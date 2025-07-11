// src/components/NewVehicles.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import '../styles/NewVehicles.css';
import { getVehicleImage } from '../utils/vehicleImages';
import TestDriveModal from './modals/TestDriveModal';

const NewVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    class: 'all',
    priceRange: 'all',
    search: ''
  });
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Price range configuration
  const priceRanges = {
    under40: { min: 0, max: 40000 },
    '40to60': { min: 40000, max: 60000 },
    '60to80': { min: 60000, max: 80000 },
    over80: { min: 80000, max: Infinity }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      // Use relative URL for API call - proxy will handle in dev, direct in prod
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, search: value }));
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
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

  // Memoized filtered vehicles for better performance
  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    // Filter by class
    if (filters.class !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.class === filters.class);
    }

    // Filter by price range
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(vehicle => {
        // Safer price parsing
        const price = parseInt(vehicle.adPrice?.replace(/[$,]/g, '') || '0');
        const { min, max } = priceRanges[filters.priceRange] || { min: 0, max: Infinity };
        return price >= min && price < max;
      });
    }

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter(vehicle => 
        vehicle.vehicle.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.stockNumber.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return filtered;
  }, [vehicles, filters]);

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({ class: 'all', priceRange: 'all', search: '' });
    setSearchInput('');
  };

  // Open test drive modal
  const openTestDriveModal = (vehicle) => {
    setSelectedVehicle({
      id: vehicle._id,
      model: vehicle.vehicle
    });
    setModalOpen(true);
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
            value={searchInput}
            onChange={handleSearchChange}
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
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </div>

      <div className="inventory-grid">
        {filteredVehicles.length === 0 ? (
          <div className="no-results">
            <p>No vehicles match your search criteria.</p>
            <button onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card">
              <div className="vehicle-image">
                <img 
                  src={getVehicleImage(vehicle.vehicle)}
                  alt={vehicle.vehicle}
                  onError={(e) => {
                    e.target.src = '/images/sklogoV2300.png';
                  }}
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
                  <button className="btn-primary" onClick={() => navigate(`/vehicle/${vehicle._id}`)}>View Details</button>
                  <button className="btn-secondary" onClick={() => openTestDriveModal(vehicle)}>Schedule Test Drive</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Test Drive Modal */}
      <TestDriveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={selectedVehicle}
      />
    </div>
  );
};

export default NewVehicles;