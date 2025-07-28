// File: backend/src/api/tts.js (CORRECTED)
// Purpose: Handle TTS API requests

const express = require('express');
const router = express.Router();
const { generateSpeech } = require('../services/elevenLabsService');

router.post('/', async (req, res) => {
  const { text } = req.body;

  console.log('TTS API called');
  console.log('Request body:', req.body);

  if (!text) {
    console.log('❌ No text provided in request');
    return res.status(400).json({ error: 'Text is required.' });
  }

  try {
    console.log('🎵 Generating speech for text:', text);
    
    // This returns a Buffer directly
    const audioBuffer = await generateSpeech(text);
    
    console.log('✅ Audio generated successfully');
    console.log(`Buffer size: ${audioBuffer.length} bytes`);

    // Set proper headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    
    // Only set Content-Length if we have a valid buffer with length
    if (audioBuffer && typeof audioBuffer.length === 'number') {
      res.setHeader('Content-Length', audioBuffer.length);
    }
    
    // Send the buffer directly
    res.send(audioBuffer);
    
    console.log('✅ Audio sent to client successfully');

  } catch (err) {
    console.error('❌ Error in TTS API:', err);
    console.error('Error stack:', err.stack);
    
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;