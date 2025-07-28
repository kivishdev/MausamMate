// File: backend/src/api/water.js
// Purpose: This file defines the API route for fetching water data.

const express = require('express');
const router = express.Router();
const { getUsgsWaterData } = require('../services/usgsWaterService');

/**
 * Route to get water data for a specific location.
 * The location ID is passed as a URL parameter.
 * Example Usage: GET /api/water/01646500
 */
router.get('/:locationId', async (req, res) => {
  // We get the locationId from the request parameters (e.g., the "01646500" part of the URL).
  const { locationId } = req.params;

  // We check if a locationId was provided.
  if (!locationId) {
    return res.status(400).json({ error: 'USGS Location ID is required.' });
  }

  try {
    // We call our service function to get the data.
    const data = await getUsgsWaterData(locationId);
    // We send the fetched data back to the client as JSON.
    res.json(data);
  } catch (err) {
    // If any error occurs in the service, we send a 500 Internal Server Error response.
    res.status(500).json({ error: err.message });
  }
});

// We export the router so our main server file can use it.
module.exports = router;

// ---
