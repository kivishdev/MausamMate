// File: backend/src/websocket/speechHandler.js (NEW FILE)
// Purpose: This file handles all real-time WebSocket connections for speech transcription.

const { WebSocketServer } = require('ws');
const { createSpeechmaticsJWT } = require("@speechmatics/auth");
const { RealtimeClient } = require("@speechmatics/real-time-client");

/**
 * Initializes the WebSocket server and attaches it to the main HTTP server.
 * @param {http.Server} server - The main HTTP server instance from Express.
 */
const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws) => {
    console.log('Frontend client connected for real-time speech.');

    const client = new RealtimeClient();

    // A. When the Speechmatics client gets a transcript, send it back to our frontend
    client.addEventListener("receiveMessage", ({ data }) => {
      if (data.message === "AddTranscript") {
        ws.send(JSON.stringify(data));
      } else if (data.message === "EndOfTranscript") {
        console.log('End of transcript received from Speechmatics.');
        ws.send(JSON.stringify({ message: 'EndOfTranscript' }));
      } else if (data.message === "Error") {
        console.error('Speechmatics Error:', data);
        ws.send(JSON.stringify({ message: 'Error', error: data }));
      }
    });

    // B. When our frontend sends an audio chunk, forward it to Speechmatics
    ws.on('message', (message) => {
      if (Buffer.isBuffer(message)) {
        client.sendAudio(message);
      }
    });

    // C. When the frontend connection closes, stop the Speechmatics session
    ws.on('close', () => {
      console.log('Frontend client disconnected.');
      client.stopRecognition();
    });

    try {
      // D. Start the Speechmatics session when the frontend connects
      const apiKey = process.env.SPEECHMATICS_API_KEY;
      const jwt = await createSpeechmaticsJWT({
        type: "rt",
        apiKey,
        ttl: 3600, // Token valid for 1 hour
      });

      await client.start(jwt, {
        transcription_config: {
          language: "hi",
          operating_point: "enhanced",
        },
      });
      console.log('Speechmatics session started.');
    } catch (error) {
      console.error('Failed to start Speechmatics session:', error);
      ws.close();
    }
  });

  console.log('WebSocket server for speech initialized.');
};

module.exports = { initializeWebSocket };


// ---