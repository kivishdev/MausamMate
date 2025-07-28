// File: backend/src/api/location.js
// Purpose: This file defines the API route for fetching the user's geolocation.

const express = require('express');
const router = express.Router();
const { getGeoLocation } = require('../services/ipApiService');

/**
 * Route to get the user's current location based on their IP address.
 * Example Usage: GET /api/location
 */
router.get('/', async (req, res) => {
  try {
    // We call our service function to get the location data.
    const locationData = await getGeoLocation();
    // We send the fetched data back to the client as JSON.
    res.json(locationData);
  } catch (err) {
    // If any error occurs in the service, we send a 500 Internal Server Error response.
    res.status(500).json({ error: err.message });
  }
});

// We export the router so our main server file can use it.
module.exports = router;

// ---