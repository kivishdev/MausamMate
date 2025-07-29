// File: backend/src/api/ai.js (THE FINAL, CORRECT, SMART VERSION)
// Purpose: This route now intelligently handles requests with either coordinates OR a location name.

const express = require('express');
const router = express.Router();
const { getAiWeatherResponse } = require('../services/aiService');
const { getCoordinatesForPlace } = require('../services/geocodingService'); // We need this to be smart

// Simple in-memory session storage
const userSessions = new Map();
setInterval(() => {
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
  for (const [sessionId, data] of userSessions.entries()) {
    if (data.lastActivity < thirtyMinutesAgo) {
      userSessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000);


router.post('/', async (req, res) => {
  // We accept 'location' as an alternative to 'lat' and 'lon'
  const { question, lat, lon, location, sessionId } = req.body;

  // --- Input Validation ---
  if (!question) {
    return res.status(400).json({ error: 'Missing required field: question.' });
  }
  if (!lat && !lon && !location) {
    return res.status(400).json({ error: 'Missing required fields: please provide either lat/lon or a location name.' });
  }

  try {
    let finalLat = lat;
    let finalLon = lon;

    // --- The Smart Logic ---
    // If we don't have coordinates, but we have a location name, we geocode it first.
    if (!lat || !lon) {
      console.log(`Coordinates not provided. Geocoding location: "${location}"`);
      const locationData = await getCoordinatesForPlace(location);
      finalLat = locationData.lat;
      finalLon = locationData.lon;
      console.log(`Geocoding successful: [${finalLat}, ${finalLon}]`);
    }
    
    // --- The Rest of the Flow (Remains the Same) ---
    const currentSessionId = sessionId || ('session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    const sessionData = userSessions.get(currentSessionId);
    const isFirstQuestion = !sessionData;
    
    // Our aiService always gets the final coordinates.
    const aiResponse = await getAiWeatherResponse(question, finalLat, finalLon, isFirstQuestion);

    userSessions.set(currentSessionId, {
      questionCount: (sessionData?.questionCount || 0) + 1,
      lastActivity: Date.now(),
      location: { lat: finalLat, lon: finalLon }
    });

    res.status(200).json({
      success: true,
      answer: aiResponse,
      sessionId: currentSessionId,
      isFirstQuestion: isFirstQuestion,
      questionCount: userSessions.get(currentSessionId).questionCount
    });

  } catch (error) {
    console.error("AI Route Error:", error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response. Please try again later.'
    });
  }
});

module.exports = router;