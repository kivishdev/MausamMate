// File: backend/server.js (FINAL UPDATED VERSION)
// Purpose: This is the complete server file with the Vercel root route fix.

// ✅ CRITICAL: Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const http = require('http');
const cors = require('cors');
const { initializeWebSocket } = require('./src/websocket/speechHandler');

// --- Import all API routes ---
const weatherRoutes = require("./src/api/weather");
const waterRoutes = require("./src/api/water");
const locationRoutes = require("./src/api/location");
const aiRoutes = require("./src/api/ai");
const geocodeRoutes = require("./src/api/geocode");
// Note: tts and full-flow routes were removed in the cleanup
// const ttsRoutes = require("./src/api/tts");
// const fullFlowRoutes = require("./src/api/fullFlow");

// --- Express App Setup ---
const app = express();

// --- CORS Configuration ---
const corsOptions = {
  // Replace this with your actual frontend URL once it's deployed
  origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'], 
};
app.use(cors(corsOptions));
app.use(express.json());

// --- THE FIX: Add a handler for the root URL ("/") ---
// This tells Vercel what to show at the main address.
app.get("/", (req, res) => {
  res.status(200).send("MausamMate Backend is running successfully!");
});
// ---------------------------------------------

// --- Register all API routes ---
app.use("/api/weather", weatherRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/geocode", geocodeRoutes);
// app.use("/api/text-to-speech", ttsRoutes);
// app.use("/api/full-flow", fullFlowRoutes);

// --- Server and WebSocket Initialization ---
const server = http.createServer(app);
// Note: WebSocket is initialized but speech services were removed.
// This can be re-enabled later.
// initializeWebSocket(server); 

// --- Start the Server ---
const PORT = process.env.PORT || 4000;
// We use server.listen now instead of app.listen
server.listen(PORT, () => {
  console.log(`MausamMate backend running on port ${PORT}`);
});
