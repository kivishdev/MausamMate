const express = require("express");
const router = express.Router();
const { getOpenMeteoWeather } = require("../services/openMeteoService");

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required." });
  }

  try {
    const data = await getOpenMeteoWeather(lat, lon);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

module.exports = router;
