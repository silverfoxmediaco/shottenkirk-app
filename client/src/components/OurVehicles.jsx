// src/components/OurVehicles.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OurVehicles.css';

const vehicleData = {
  Chrysler: [
    {
      name: 'Pacifica',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Chrysler/pacifica.png',
      link: '/new-vehicles',
    },
    {
      name: 'Pacifica Plug-In Hybrid',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Chrysler/pacifica-hybrid.png',
      link: '/new-vehicles',
    },
  ],
  Dodge: [
    {
      name: 'Durango',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Dodge/durango.png',
      link: '/new-vehicles',
    },
    {
      name: 'Charger',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Dodge/charger.png',
      link: '/new-vehicles',
    },
    {
      name: 'Hornet',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Dodge/hornet.png',
      link: '/new-vehicles',
    },
  ],
  Jeep: [
    {
      name: 'Compass',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Jeep/compass.png',
      link: '/new-vehicles',
    },
    {
      name: 'Grand Cherokee',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Jeep/new-grand-cherokee.png',
      link: '/new-vehicles',
    },
    {
      name: 'Wrangler',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Jeep/wrangler.png',
      link: '/new-vehicles',
    },
  ],
  Ram: [
    {
      name: 'RAM 1500',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Ram/1500-ram.png',
      link: '/new-vehicles',
    },
    {
      name: 'RAM 2500',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Ram/ram-2500.png',
      link: '/new-vehicles',
    },
    {
      name: 'Promaster',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Ram/promaster.png',
      link: '/new-vehicles',
    },
  ],
};

const OurVehicles = () => {
  const [selectedBrand, setSelectedBrand] = useState('Ram');
  const navigate = useNavigate();

  const handleVehicleClick = (e, vehicleName) => {
    e.preventDefault();
    // For now, navigate to the main inventory page
    // You can later add query params or filters based on the vehicle
    navigate('/new-vehicles');
  };

  const handleViewInventory = () => {
    navigate('/new-vehicles');
  };

  return (
    <section className="our-vehicles">
      <h2>
        Our Vehicles
        <span className="subheader">Select a vehicle to browse our inventory</span>
      </h2>

      <div className="tabs">
        {Object.keys(vehicleData).map((brand) => (
          <button
            key={brand}
            className={`tab-button ${selectedBrand === brand ? 'active' : ''}`}
            onClick={() => setSelectedBrand(brand)}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="vehicle-grid">
        {vehicleData[selectedBrand].map((vehicle) => (
          <a 
            key={vehicle.name} 
            href={vehicle.link} 
            className="vehicle-card"
            onClick={(e) => handleVehicleClick(e, vehicle.name)}
          >
            <img src={vehicle.img} alt={vehicle.name} />
            <p>{vehicle.name}</p>
          </a>
        ))}
      </div>

      <div className="view-all-button">
        <button className="button-primary" onClick={handleViewInventory}>
          View All New Vehicles
        </button>
      </div>
    </section>
  );
};

export default OurVehicles;