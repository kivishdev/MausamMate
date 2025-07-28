// server.js (Corrected)

// ✅ CRITICAL: Load environment variables FIRST, before anything else.
require("dotenv").config();

// --- Now, import all other modules ---
const express = require("express");
const http = require('http');
const { initializeWebSocket } = require('./src/websocket/speechHandler');

// --- Import all API routes ---
const weatherRoutes = require("./src/api/weather");
const waterRoutes = require("./src/api/water");
const locationRoutes = require("./src/api/location");
const aiRoutes = require("./src/api/ai"); // This will now load correctly
const ttsRoutes = require("./src/api/tts");
const fullFlowRoutes = require("./src/api/fullFlow");

// --- Express App Setup ---
const app = express();
app.use(express.json());

// --- Register all API routes ---
app.use("/api/weather", weatherRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/ai", aiRoutes); // The routing itself was correct
app.use("/api/text-to-speech", ttsRoutes);
app.use("/api/full-flow", fullFlowRoutes);

// --- Server and WebSocket Initialization ---
const server = http.createServer(app);
initializeWebSocket(server);

// --- Start the Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`MausamMate backend running on port ${PORT}`);
});