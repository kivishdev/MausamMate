// File: backend/server.js (UPDATE THIS FILE)
// Purpose: We need to tell our server to use this new geocode route.

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
const aiRoutes = require("./src/api/ai");
const ttsRoutes = require("./src/api/tts");
const fullFlowRoutes = require("./src/api/fullFlow");
const geocodeRoutes = require("./src/api/geocode"); // <-- 1. IMPORT THE NEW GEOCODE ROUTE

// --- Express App Setup ---
const app = express();
app.use(express.json());

// --- Register all API routes ---
app.use("/api/weather", weatherRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/text-to-speech", ttsRoutes);
app.use("/api/full-flow", fullFlowRoutes);
app.use("/api/geocode", geocodeRoutes); // <-- 2. USE THE NEW GEOCODE ROUTE

// --- Server and WebSocket Initialization ---
const server = http.createServer(app);
initializeWebSocket(server);

// --- Start the Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`MausamMate backend running on port ${PORT}`);
});
