// ========================================================================
// File: backend/server.js (FINAL VERSION WITH RENDER KEEP-ALIVE + FIXED CORS)
// ========================================================================
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// --- Import all API routes ---
const weatherRoutes = require("./src/api/weather");
const waterRoutes = require("./src/api/water");
const locationRoutes = require("./src/api/location");
const aiRoutes = require("./src/api/ai");
const geocodeRoutes = require("./src/api/geocode");

// --- Express App Setup ---
const app = express();

// ✅ Allowed Origins (localhost + prod from .env)
const allowedOrigins = [
  "http://localhost:5173",                // Dev frontend
  process.env.PROD_FRONTEND_URL || ""     // Prod frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("🚫 CORS blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight
app.use(express.json());

// 🔎 Debug Middleware – log every request + origin
app.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.originalUrl} | Origin: ${req.headers.origin}`);
  next();
});

// --- Root Route Handler ---
app.get("/", (_req, res) => {
  res.status(200).send("🌤️ MausamMate Backend is running successfully!");
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
  console.log(`✅ MausamMate backend running on port ${PORT}`);
});

// --- THE FIX: Keep-Alive Tweak for Render ---
setInterval(() => {
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_URL) {
    console.log("🔄 Pinging self to keep Render instance alive...");
    fetch(RENDER_URL)
      .then(() => console.log("✅ Keep-alive successful"))
      .catch(err => console.error("⚠️ Keep-alive ping failed:", err.message));
  }
}, 14 * 60 * 1000); // every 14 min
