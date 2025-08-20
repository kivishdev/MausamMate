// File: backend/server.js (FINAL CLEANED VERSION WITHOUT VOICE)
// Purpose: The main server file with only the core, working API routes.

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
  origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Register all API routes ---
app.use("/api/weather", weatherRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/geocode", geocodeRoutes);

// --- Start the Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MausamMate backend running on port ${PORT}`);
});
