// File: backend/src/services/openMeteoService.js (UPDATED WITH CLEAN URL BUILDER)
// Purpose: This file fetches a comprehensive set of weather data using a clean, maintainable URL builder.

const axios = require("axios");

/**
 * Fetches a complete A-Z weather forecast from Open-Meteo.
 * @param {string} lat - Latitude of the location.
 * @param {string} lon - Longitude of the location.
 * @returns {Promise<object>} - A promise that resolves to the most detailed weather data available.
 */
const getOpenMeteoWeather = async (lat, lon) => {
  // --- Building the Weather URL (Clean Method) ---
  const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
  weatherUrl.search = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone: 'auto',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,uv_index_clear_sky',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant'
  });

  // --- Building the Air Quality URL (Clean Method) ---
  const airQualityUrl = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  airQualityUrl.search = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi'
  });

  console.log("Fetching A-Z weather data from Open-Meteo...");

  try {
    // We use Promise.all to fetch both APIs at the same time for better performance.
    const [weatherResponse, airQualityResponse] = await Promise.all([
      axios.get(weatherUrl.toString()),
      axios.get(airQualityUrl.toString())
    ]);

    // We combine both results into one big JSON object.
    const combinedData = {
      ...weatherResponse.data, // All the weather data
      air_quality: airQualityResponse.data // All the air quality data
    };

    return combinedData;

  } catch (error) {
    console.error("Error fetching comprehensive data from Open-Meteo API:", error.message);
    throw new Error("Failed to fetch comprehensive Open-Meteo weather data.");
  }
};

module.exports = { getOpenMeteoWeather };