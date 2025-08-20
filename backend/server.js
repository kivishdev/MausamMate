// ========================================================================
// File: backend/server.js (THE FINAL, CORRECTED VERSION)
// ========================================================================
require("dotenv").config();

const express = require("express");
const cors = require('cors');

// --- Import all API routes ---
const weatherRoutes = require("./src/api/weather");
const waterRoutes = require("./src/api/water");
const locationRoutes = require("./src/api/location");
const aiRoutes = require("./src/api/ai");
const geocodeRoutes = require("./src/api/geocode");

// --- Express App Setup ---
const app = express();

const corsOptions = {
  // Add your frontend's live URL here once it's deployed
  origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'], 
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Root Route Handler ---
app.get("/", (_req, res) => {
  res.status(200).send("MausamMate Backend is running successfully!");
});

// --- Register all API routes ---
app.use("/api/weather", weatherRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/geocode", geocodeRoutes);

// --- Start the Server ---
const PORT = process.env.PORT || 4000;

// THE FIX: We are using app.listen() because we are not using WebSockets right now.
// This is the correct and simple way to start the server.
app.listen(PORT, () => {
  console.log(`MausamMate backend running on port ${PORT}`);
});
