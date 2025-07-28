// File: backend/src/api/ai.js
// Purpose: Defines the API route for handling AI-based weather queries with session tracking.

const express = require('express');
const router = express.Router();
const { getAiWeatherResponse } = require('../services/aiService');

// Simple in-memory session storage (use Redis/Database in production)
const userSessions = new Map();

// Session cleanup - remove old sessions after 30 minutes
setInterval(() => {
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
  for (const [sessionId, data] of userSessions.entries()) {
    if (data.lastActivity < thirtyMinutesAgo) {
      userSessions.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

/**
 * @route   POST /api/ai
 * @desc    Get AI-powered weather insights based on question and coordinates
 * @body    { question: String, lat: String|Number, lon: String|Number, sessionId?: String }
 * @returns { answer: String, sessionId: String, isFirstQuestion: Boolean }
 */
router.post('/', async (req, res) => {
  const { question, lat, lon, sessionId } = req.body;

  // Validate inputs
  if (!question || !lat || !lon) {
    return res.status(400).json({
      error: 'Missing required fields: question, lat, lon.'
    });
  }

  try {
    // Generate or use existing session ID
    const currentSessionId = sessionId || generateSessionId();
    
    // Check if this is user's first question in this session
    const sessionData = userSessions.get(currentSessionId);
    const isFirstQuestion = !sessionData;
    
    // Get AI response with conversation context
    const aiResponse = await getAiWeatherResponse(question, lat, lon, isFirstQuestion);

    // Update session data
    userSessions.set(currentSessionId, {
      questionCount: (sessionData?.questionCount || 0) + 1,
      lastActivity: Date.now(),
      location: { lat, lon }
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

/**
 * @route   DELETE /api/ai/session/:sessionId
 * @desc    Clear a specific session (optional endpoint for session management)
 */
router.delete('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (userSessions.has(sessionId)) {
    userSessions.delete(sessionId);
    res.json({ success: true, message: 'Session cleared successfully.' });
  } else {
    res.status(404).json({ success: false, error: 'Session not found.' });
  }
});

/**
 * @route   GET /api/ai/sessions
 * @desc    Get active sessions count (for debugging/monitoring)
 */
router.get('/sessions', (req, res) => {
  res.json({
    activeSessions: userSessions.size,
    sessions: Array.from(userSessions.entries()).map(([id, data]) => ({
      sessionId: id,
      questionCount: data.questionCount,
      lastActivity: new Date(data.lastActivity).toISOString(),
      location: data.location
    }))
  });
});

// Utility function to generate unique session IDs
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;