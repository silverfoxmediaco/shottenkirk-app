// src/components/OurVehicles.jsx

import React, { useState } from 'react';
import '../styles/OurVehicles.css';

const vehicleData = {
  Chrysler: [
    {
      name: 'Pacifica',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Chrysler/pacifica.png',
      link: '/new-vehicles/pacifica/',
    },
    {
      name: 'Pacifica Plug-In Hybrid',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Chrysler/pacifica-hybrid.png',
      link: '/new-vehicles/pacifica-plug-in-hybrid/',
    },
  ],
  Dodge: [
    {
      name: 'Durango',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Dodge/durango.png',
      link: '/new-vehicles/durango/',
    },
    {
      name: 'Charger',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Dodge/charger.png',
      link: '/new-vehicles/charger/',
    },
    {
      name: 'Hornet',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Dodge/hornet.png',
      link: '/new-vehicles/hornet/',
    },
  ],
  Jeep: [
    {
      name: 'Compass',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Jeep/compass.png',
      link: '/new-vehicles/compass/',
    },
    {
      name: 'Grand Cherokee',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Jeep/new-grand-cherokee.png',
      link: '/new-vehicles/grand-cherokee/',
    },
    {
      name: 'Wrangler',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Jeep/wrangler.png',
      link: '/new-vehicles/wrangler/',
    },
  ],
  Ram: [
    {
      name: 'RAM 1500',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Ram/1500-ram.png',
      link: '/new-vehicles/ram-1500/',
    },
    {
      name: 'RAM 2500',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Ram/ram-2500.png',
      link: '/new-vehicles/ram-2500/',
    },
    {
      name: 'Promaster',
      img: 'https://di-sitebuilder-assets.dealerinspire.com/Stellantis/modelImages/Ram/promaster.png',
      link: '/new-vehicles/promaster/',
    },
  ],
};

const OurVehicles = () => {
  const [selectedBrand, setSelectedBrand] = useState('Ram');

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
          <a key={vehicle.name} href={vehicle.link} className="vehicle-card">
            <img src={vehicle.img} alt={vehicle.name} />
            <p>{vehicle.name}</p>
          </a>
        ))}
      </div>

      <div className="view-all-button">
        <a href="/new-vehicles/" className="button-primary">View All New Vehicles</a>
      </div>
    </section>
  );
};

export default OurVehicles;
