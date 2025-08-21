// File: backend/src/services/geocodingService.js (FIXED)
// Purpose: This service converts a location name into coordinates using the reliable LocationIQ API.

const axios = require('axios');
const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

/**
 * Fetches coordinates for a given location name using the LocationIQ Forward Geocoding API.
 * @param {string} placeName - The name of the place to search for (e.g., "Bhayandar", "Delhi").
 * @returns {Promise<object>} - A promise that resolves to an array of location objects.
 */
const getCoordinatesForPlace = async (placeName) => {
  const encodedPlaceName = encodeURIComponent(placeName);
  // LocationIQ Forward Geocoding API URL
  const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodedPlaceName}&format=json&limit=15`;

  console.log(`Geocoding for: "${placeName}" using LocationIQ API...`);

  try {
    const response = await axios.get(url);
    const data = response.data;

    // We check if any results were found.
    if (data && data.length > 0) {
      const locations = data.map((result) => ({
        name: result.display_name,
        country: result.address?.country || null,
        admin1: result.address?.state || null, // Usually the state
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      }));

      // Fixed: Log the first result properly since locations is an array
      const firstLocation = locations[0];
      console.log(`Geocoding successful: ${firstLocation.name}, ${firstLocation.admin1} -> [${firstLocation.lat}, ${firstLocation.lon}]`);
      
      return locations; // Return the array of locations
    } else {
      throw new Error(`No results found for "${placeName}"`);
    }
  } catch (error) {
    console.error("Error fetching data from LocationIQ API:", error.message);
    throw new Error("Failed to get coordinates for the given place.");
  }
};

module.exports = { getCoordinatesForPlace };