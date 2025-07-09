// src/pages/Home.jsx

import React from 'react';
import '../styles/Home.css';
import Hero from '../components/Hero';
import ModelSlider from '../components/ModelSlider';
import OurVehicles from '../components/OurVehicles';


const Home = () => {
  return (
    <main>
      <Hero />
      <ModelSlider />
      <OurVehicles />
      <section className="seo-content">
  <h2>Welcome to Prosper Chrysler Dodge Jeep Ram</h2>
  <p>
    Are you in the market for a new or used Chrysler, Dodge, Jeep, or Ram vehicle? With an impressive selection of sedans, SUVs, and trucks for you to choose from, Shottenkirk Chrysler Dodge Jeep Ram Prosper is your local car dealership...
  </p>
  <p>
    When you're ready to start the car buying process at your local Texas RAM dealer, you can depend on the expertise of the sales professionals at our finance center...
  </p>
  <p>
    At Shottenkirk Chrysler Dodge Jeep Ram Prosper, our advanced service center is designed to meet all your automotive needs...
  </p>
  <p>
    If you’re looking for a new or pre-owned vehicle, Shottenkirk Chrysler Dodge Jeep Ram Prosper is your go-to dealership near Dallas...
  </p>
</section>

    </main>
  );
};

export default Home;
