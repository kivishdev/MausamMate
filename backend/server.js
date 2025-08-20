// File: backend/server.js (FINAL VERSION WITH RENDER KEEP-ALIVE TWEAK)
// Purpose: This version includes a self-pinging mechanism to prevent Render's free tier from sleeping.

require("dotenv").config();

const express = require("express");
const http = require('http');
const cors = require('cors');
// const { initializeWebSocket } = require('./src/websocket/speechHandler'); 

// --- Import all API routes ---
const weatherRoutes = require("./src/api/weather");
const waterRoutes = require("./src/api/water");
const locationRoutes = require("./src/api/location");
const aiRoutes = require("./src/api/ai");
const geocodeRoutes = require("./src/api/geocode");

// --- Express App Setup ---
const app = express();

// --- CORS Configuration ---
const corsOptions = {
  origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'], 
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Root Route Handler ---
app.get("/", (req, res) => {
  res.status(200).send("MausamMate Backend is running successfully!");
});

// --- Register all API routes ---
app.use("/api/weather", weatherRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/geocode", geocodeRoutes);

// --- Server and WebSocket Initialization ---
// const server = http.createServer(app);
// initializeWebSocket(server); 

// --- Start the Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`MausamMate backend running on port ${PORT}`);
});

// --- THE FIX: Keep-Alive Tweak for Render ---
// Render's free instances spin down after 15 minutes of inactivity.
// This self-pinging mechanism sends a request to our own server every 14 minutes.
setInterval(() => {
  // Render provides the server's public URL in this environment variable.
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_URL) {
    console.log("Pinging self to keep Render instance alive...");
    // We use fetch to make a GET request to our own root URL.
    fetch(RENDER_URL).catch(err => console.error("Keep-alive ping failed:", err.message));
  }
}, 14 * 60 * 1000); // Ping every 14 minutes (14 * 60 * 1000 milliseconds)
