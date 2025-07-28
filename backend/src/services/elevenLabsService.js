// File: backend/src/services/elevenLabsService.js (CORRECTED)
// Purpose: Generate speech using ElevenLabs TTS

const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");

const generateSpeech = async (textToSpeak) => {
  if (!textToSpeak || typeof textToSpeak !== 'string' || textToSpeak.trim().length === 0) {
    throw new Error("Text to speak is required and cannot be empty.");
  }

  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY environment variable is not set");
  }

  const elevenlabs = new ElevenLabsClient({ 
    apiKey: process.env.ELEVENLABS_API_KEY 
  });

  console.log(`Generating speech with ElevenLabs...`);
  console.log(`Text: "${textToSpeak}"`);

  try {
    // The convert method might return an async iterable or buffer
    const audioData = await elevenlabs.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
      text: textToSpeak,
    });

    console.log("Audio data received from ElevenLabs");
    console.log("Audio data type:", typeof audioData);
    console.log("Audio data constructor:", audioData.constructor.name);
    
    // Check if it's an async iterable (has Symbol.asyncIterator)
    if (audioData[Symbol.asyncIterator]) {
      console.log("Converting async iterable to buffer...");
      const chunks = [];
      for await (const chunk of audioData) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);
      console.log(`Final buffer size: ${audioBuffer.length} bytes`);
      return audioBuffer;
    } 
    // Check if it's already a buffer
    else if (Buffer.isBuffer(audioData)) {
      console.log(`Buffer size: ${audioData.length} bytes`);
      return audioData;
    }
    // Check if it's a Uint8Array or similar
    else if (audioData instanceof Uint8Array || audioData.buffer) {
      console.log("Converting Uint8Array to Buffer...");
      const audioBuffer = Buffer.from(audioData);
      console.log(`Buffer size: ${audioBuffer.length} bytes`);
      return audioBuffer;
    }
    else {
      console.error("Unknown audio data format:", audioData);
      throw new Error("Received unknown audio data format from ElevenLabs");
    }

  } catch (error) {
    console.error("Error generating speech with ElevenLabs:", error);
    console.error("Error details:", error.response?.data || error.message);
    throw new Error(`Failed to generate speech: ${error.message}`);
  }
};

module.exports = {
  generateSpeech,
};

// ---