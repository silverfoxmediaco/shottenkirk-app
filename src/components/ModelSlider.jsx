// src/components/ModelSlider.jsx

import React from 'react';
import '../styles/ModelSlider.css';

import whiteRam from '../assets/whiteramdesert.png';
import whiteJeep from '../assets/whitejeepindesert.png';
import redCharger from '../assets/redcharger.png';
import blueCherokee from '../assets/navybluejeepcherokee.png';
import bluePacifica from '../assets/bluepacifica.png';

const vehicles = [
  {
    image: whiteRam,
    label: 'Truck',
    model: '2025 Ram 1500',
    price: 'Lease From $689/mo',
  },
  {
    image: whiteJeep,
    label: 'Off-Road',
    model: '2025 Jeep Wrangler',
    price: 'Lease From $659/mo',
  },
  {
    image: redCharger,
    label: 'Performance Sedan',
    model: '2025 Dodge Charger',
    price: 'Lease From $539/mo',
  },
  {
    image: blueCherokee,
    label: 'SUV',
    model: '2025 Jeep Grand Cherokee',
    price: 'Lease From $499/mo',
  },
  {
    image: bluePacifica,
    label: 'Minivan',
    model: '2025 Chrysler Pacifica',
    price: 'Lease From $475/mo',
  },
];

const ModelSlider = () => {
  return (
    <section className="model-slider">
      <h2 className="slider-title">Explore Our Lineup</h2>
      <div className="slider-track">
        {vehicles.map((vehicle, index) => (
          <div className="slide" key={index}>
            <img src={vehicle.image} alt={vehicle.model} className="slide-image" />
            <div className="slide-content">
              <span className="vehicle-label">{vehicle.label}</span>
              <h3>{vehicle.model}</h3>
              <p className="price-range">{vehicle.price}</p>
              <div className="slide-buttons">
                <button className="buy-now">Buy Now</button>
                <button className="need-financing">Test Drive</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ModelSlider;
