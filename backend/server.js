// ========================================================================
// File: backend/server.js (THE FINAL, CORRECTED VERSION WITH CORS FIX + SECURITY HEADERS)
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

// --- THE FIX: Specific CORS Configuration ---
const corsOptions = {
  origin: [
    'https://mausam-mate-2734.vercel.app',
    'http://localhost:5173'
  ],
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
// ---------------------------------------------

app.use(express.json());

// --- 🔐 Add Security Headers Middleware ---
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN"); // Prevent clickjacking
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin"); // Control referer info
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()"); // Restrict features
  next();
});
// ---------------------------------------------

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

app.listen(PORT, () => {
  console.log(`MausamMate backend running on port ${PORT}`);
});

// --- Keep-Alive Tweak for Render ---
setInterval(() => {
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_URL) {
    console.log("Pinging self to keep Render instance alive...");
    fetch(RENDER_URL).catch(err => console.error("Keep-alive ping failed:", err.message));
  }
}, 14 * 60 * 1000); // Ping every 14 minutes
