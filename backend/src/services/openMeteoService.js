// File: backend/src/services/openMeteoService.js (UPDATED TO BE SMARTER)
// Purpose: This service now intelligently handles requests with either coordinates OR a location name.

const axios = require("axios");
// 1. Hum geocoding service ko yahan import karenge
const { getCoordinatesForPlace } = require("./geocodingService");

/**
 * Fetches a complete A-Z weather forecast from Open-Meteo.
 * This function is now smart: it can accept either coordinates or a location name.
 * @param {object} options - An object containing either {lat, lon} or {location}.
 * @returns {Promise<object>} - A promise that resolves to the most detailed weather data available.
 */
const getOpenMeteoWeather = async (options) => {
  let finalLat, finalLon;

  // --- The New Smart Logic ---
  // 2. Check karo ki user ne coordinates diye hain ya location ka naam
  if (options.lat && options.lon) {
    // Agar coordinates hain, to unhe seedhe use karo
    finalLat = options.lat;
    finalLon = options.lon;
    console.log(`Using provided coordinates: [${finalLat}, ${finalLon}]`);
  } else if (options.location) {
    // Agar location ka naam hai, to pehle geocoding service se coordinates nikalo
    console.log(`Coordinates not provided. Geocoding location: "${options.location}"`);
    const locationData = await getCoordinatesForPlace(options.location);
    finalLat = locationData.lat;
    finalLon = locationData.lon;
    console.log(`Geocoding successful: [${finalLat}, ${finalLon}]`);
  } else {
    // Agar dono hi nahi hain, to error do
    throw new Error("You must provide either {lat, lon} or a {location} to get weather data.");
  }

  // --- The Rest of the Code (Remains the Same) ---
  const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
  weatherUrl.search = new URLSearchParams({
    latitude: finalLat,
    longitude: finalLon,
    timezone: 'auto',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,uv_index_clear_sky',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant'
  });

  const airQualityUrl = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  airQualityUrl.search = new URLSearchParams({
    latitude: finalLat,
    longitude: finalLon,
    hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi'
  });

  console.log("Fetching A-Z weather data from Open-Meteo...");

  try {
    const [weatherResponse, airQualityResponse] = await Promise.all([
      axios.get(weatherUrl.toString()),
      axios.get(airQualityUrl.toString())
    ]);

    const combinedData = {
      ...weatherResponse.data,
      air_quality: airQualityResponse.data
    };

    return combinedData;

  } catch (error) {
    console.error("Error fetching comprehensive data from Open-Meteo API:", error.message);
    throw new Error("Failed to fetch comprehensive Open-Meteo weather data.");
  }
};

module.exports = { getOpenMeteoWeather };