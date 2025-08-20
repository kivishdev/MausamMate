// File: backend/src/api/weather.js (THE CORRECTED VERSION)
// Purpose: This is the standard API route to get raw weather data.

const express = require('express');
const router = express.Router();
const { getOpenMeteoWeather } = require('../services/openMeteoService');

/**
 * Route to get raw weather data for a given location.
 * It can be called in two ways:
 * 1. With coordinates: GET /api/weather?lat=19.07&lon=72.88
 * 2. With a location name: GET /api/weather?location=Mumbai
 */
router.get('/', async (req, res) => {
  // We get the parameters from the query string
  const { lat, lon, location } = req.query;

  // Basic validation
  if ((!lat || !lon) && !location) {
    return res.status(400).json({ error: 'Please provide either lat/lon OR a location name.' });
  }

  try {
    // THE FIX: We create an 'options' object to pass to our smart service.
    // This is the correct way to call our updated openMeteoService.
    const options = location ? { location } : { lat, lon };
    
    const weatherData = await getOpenMeteoWeather(options);
    
    res.json(weatherData);

  } catch (err) {
    console.error("Error in /api/weather route:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

