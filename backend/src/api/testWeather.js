// File: backend/src/api/testWeather.js (NEW FILE FOR TESTING)
// Purpose: This is a temporary route to test our smart openMeteoService directly.

const express = require('express');
const router = express.Router();
const { getOpenMeteoWeather } = require('../services/openMeteoService');

/**
 * Route to test the getOpenMeteoWeather service.
 * It can be called in two ways:
 * 1. With coordinates: GET /api/test-weather?lat=19.07&lon=72.88
 * 2. With a location name: GET /api/test-weather?location=Mumbai
 */
router.get('/', async (req, res) => {
  const { lat, lon, location } = req.query;

  // Check if we have enough information
  if ((!lat || !lon) && !location) {
    return res.status(400).json({ error: 'Please provide either lat/lon OR a location name as a query parameter.' });
  }

  try {
    // Prepare the options object based on what was provided
    const options = location ? { location } : { lat, lon };
    
    // Call our smart service with the options
    const weatherData = await getOpenMeteoWeather(options);
    
    // Send back the full weather data
    res.json(weatherData);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


// ---