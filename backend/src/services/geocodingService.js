// File: backend/src/services/geocodingService.js (UPDATED WITH OPEN-METEO)
// Purpose: This service converts a location name into coordinates using the reliable Open-Meteo API.

const axios = require('axios');

/**
 * Fetches coordinates for a given location name using the Open-Meteo Geocoding API.
 * @param {string} placeName - The name of the place to search for (e.g., "Bhayandar", "Delhi").
 * @returns {Promise<object>} - A promise that resolves to an object with the best-matched location's details.
 */
const getCoordinatesForPlace = async (placeName) => {
  const encodedPlaceName = encodeURIComponent(placeName);
  // This is the URL for the Open-Meteo Geocoding API.
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedPlaceName}&count=1&language=en&format=json`;

  console.log(`Geocoding for: "${placeName}" using Open-Meteo API...`);

  try {
    const response = await axios.get(url);
    const data = response.data;

    // We check if any results were found.
    if (data && data.results && data.results.length > 0) {
      const firstResult = data.results[0];
      const location = {
        name: firstResult.name,
        country: firstResult.country,
        admin1: firstResult.admin1, // This is usually the state
        lat: firstResult.latitude,
        lon: firstResult.longitude
      };
      console.log(`Geocoding successful: ${location.name}, ${location.admin1} -> [${location.lat}, ${location.lon}]`);
      return location;
    } else {
      throw new Error(`No results found for "${placeName}"`);
    }
  } catch (error) {
    console.error("Error fetching data from Open-Meteo Geocoding API:", error.message);
    throw new Error("Failed to get coordinates for the given place.");
  }
};

module.exports = { getCoordinatesForPlace };


// ---