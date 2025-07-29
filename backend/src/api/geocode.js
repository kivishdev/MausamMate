// File: backend/src/api/geocode.js (No changes needed)
// Purpose: This file defines the API endpoint for our geocoding service.

const express = require('express');
const router = express.Router();
const { getCoordinatesForPlace } = require('../services/geocodingService');

router.get('/', async (req, res) => {
  const { place } = req.query;

  if (!place) {
    return res.status(400).json({ error: 'place query parameter is required.' });
  }

  try {
    const locationData = await getCoordinatesForPlace(place);
    res.json(locationData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
