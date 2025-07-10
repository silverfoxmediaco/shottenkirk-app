// client/src/utils/vehicleImages.js

export const vehicleImages = {
    // Exact matches from your database
    "2025 Jeep Gladiator Rubicon": "/images/jeepgladiator.png",
    "2025 Jeep Wrangler Rubicon X": "/images/jeeprubicon.png",
    "2025 Jeep Grand Cherokee Summit": "/images/2025jeepgrandcherokee.png",
    "2026 Ram 1500 Rebel": "/images/2025ramrebel.png",
    "2025 Jeep Wrangler Willys": "/images/jeepwilly.png",
    "2025 Dodge Hornet GT": "/images/dodgehornet.png",
    "2025 Ram 2500 Laramie": "/images/2025Ram2500Laramie.png",
    "2025 Jeep Grand Cherokee Limited": "/images/2025jeepgrandcherokeelimited.png",
    "2025 Dodge Durango R/T Plus": "/images/2025dodgedurango.png",
    "2025 Jeep Grand Cherokee Altitude X": "/images/2025jeepgrandaltitudex.png",
    "2025 Jeep Wrangler Sahara": "/images/2025jeepsahara.png",
    "2025 Chrysler Pacifica Limited": "/images/2025pacificalimited.png",
    "2025 Ram 1500 Big Horn/Lone Star": "/images/ramlonghorn.png",
    "2025 Jeep Gladiator Nighthawk": "/images/jeepgldiatornighthawk.png",
    
    // Additional vehicles from your database that need images
    "2025 Jeep Grand Cherokee L Limited": "/images/2025jeepgrandcherokeelimited.png",
    "2025 Jeep Grand Cherokee Overland": "/images/2025jeepgrandcherokee.png",
    "2025 Jeep Wagoneer Series II": "/images/2025jeepgrandcherokee.png", // Using Grand Cherokee as placeholder
  };
  
  export const getVehicleImage = (vehicleName) => {
    console.log('Looking for vehicle:', vehicleName);
    console.log('Vehicle exists in map?', vehicleImages.hasOwnProperty(vehicleName));
    const imagePath = vehicleImages[vehicleName] || "/sklogoV2300.png";
    console.log('Returning image path:', imagePath);
    return imagePath;
  };