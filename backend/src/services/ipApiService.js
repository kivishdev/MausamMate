// File: backend/src/services/ipApiService.js
// Purpose: This file contains the logic to fetch geolocation data from the IP-API.

const axios = require('axios');

/**
 * Fetches geolocation data based on the user's IP address.
 * @returns {Promise<object>} - A promise that resolves to the JSON data containing location info.
 */
const getGeoLocation = async () => {
  // This is the base URL for the IP-API. It automatically uses the IP address of whoever is calling it.
  const url = `http://ip-api.com/json`;

  console.log("Fetching geolocation data from IP-API...");

  try {
    const response = await axios.get(url);
    // We check if the API call was successful before returning the data.
    if (response.data.status === 'success') {
      return response.data;
    } else {
      throw new Error('IP-API returned an error: ' + response.data.message);
    }
  } catch (error) {
    // If the API call fails, we log the error and throw it.
    console.error('Error fetching data from IP-API:', error.message);
    throw new Error('Failed to fetch geolocation data.');
  }
};

// We export the function so it can be used by our route handlers.
module.exports = { getGeoLocation };
