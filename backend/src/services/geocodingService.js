// File: backend/src/services/geocodingService.js (UPDATED WITH LOCATIONIQ)
// Purpose: This service converts a location name into coordinates using the reliable LocationIQ API.

const axios = require('axios');
const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

/**
 * Fetches coordinates for a given location name using the LocationIQ Forward Geocoding API.
 * @param {string} placeName - The name of the place to search for (e.g., "Bhayandar", "Delhi").
 * @returns {Promise<object>} - A promise that resolves to an object with the best-matched location's details.
 */
const getCoordinatesForPlace = async (placeName) => {
  const encodedPlaceName = encodeURIComponent(placeName);
  // LocationIQ Forward Geocoding API URL
  const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodedPlaceName}&format=json&limit=1`;

  console.log(`Geocoding for: "${placeName}" using LocationIQ API...`);

  try {
    const response = await axios.get(url);
    const data = response.data;

    // We check if any results were found.
    if (data && data.length > 0) {
      const firstResult = data[0];
      const location = {
        name: firstResult.display_name, // keeping similar to Open-Meteo's "name"
        country: firstResult.address?.country || null,
        admin1: firstResult.address?.state || null, // This is usually the state
        lat: parseFloat(firstResult.lat),
        lon: parseFloat(firstResult.lon)
      };
      console.log(`Geocoding successful: ${location.name}, ${location.admin1} -> [${location.lat}, ${location.lon}]`);
      return location;
    } else {
      throw new Error(`No results found for "${placeName}"`);
    }
  } catch (error) {
    console.error("Error fetching data from LocationIQ API:", error.message);
    throw new Error("Failed to get coordinates for the given place.");
  }
};

module.exports = { getCoordinatesForPlace };
