// File: backend/src/api/fullFlow.js (NEW FILE)
// Purpose: This file defines the end-to-end test endpoint that combines multiple services.

const express = require('express');
const router = express.Router();
const { getAiWeatherResponse } = require('../services/aiService'); // Reusing our AI service
const { generateSpeech } = require('../services/elevenLabsService'); // Reusing our TTS service

/**
 * Route to handle a full-flow request: Weather -> AI -> Voice
 * Example Usage: POST /api/full-flow
 * Body: { "question": "Aaj ka mausam kaisa hai?", "lat": "19.29", "lon": "72.85" }
 */
router.post('/', async (req, res) => {
  const { question, lat, lon } = req.body;

  if (!question || !lat || !lon) {
    return res.status(400).json({ error: 'Question, latitude, and longitude are required.' });
  }

  try {
    // Step 1: Get the text answer from Gemini (which internally calls OpenMeteo).
    console.log("--- Starting Full Flow Test ---");
    console.log("Step 1: Getting AI response...");
    const aiResponse = await getAiWeatherResponse(question, lat, lon);
    console.log(`Step 1 Complete. AI Response: "${aiResponse}"`);

    // Step 2: Convert the AI's text answer into speech using ElevenLabs.
    console.log("Step 2: Converting AI response to speech...");
    const audioBuffer = await generateSpeech(aiResponse);
    console.log("Step 2 Complete. Audio generated.");

    // Step 3: Send the final audio back to the user.
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);
    console.log("--- Full Flow Test Complete. Audio sent to client. ---");

  } catch (err) {
    console.error("Error during full flow test:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


// ---