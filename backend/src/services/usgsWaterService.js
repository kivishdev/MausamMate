// File: backend/src/services/usgsWaterService.js (UPDATED)
// Purpose: This file contains the logic to fetch data from the stable USGS Water Services API.

const axios = require('axios');

/**
 * Fetches real-time water data for a specific USGS location ID using the NWIS service.
 * NOTE: This API provides data for locations within the USA only.
 * @param {string} locationId - The official ID of the USGS monitoring station (e.g., "01646500").
 * @returns {Promise<object>} - A promise that resolves to the JSON data from the API.
 */
const getUsgsWaterData = async (locationId) => {
  // This is the new, stable URL for the USGS Instantaneous Values service.
  // We are requesting two parameters:
  // 00060 = Streamflow (Discharge) in cubic feet per second
  // 00065 = Gage Height (water level) in feet
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${locationId}&parameterCd=00060,00065`;

  console.log(`Fetching data from stable USGS NWIS service for site: ${locationId}`);

  try {
    const response = await axios.get(url);
    // The actual data is in the 'data' property of the response.
    return response.data;
  } catch (error) {
    // If the API call fails, we log the error and throw it.
    console.error('Error fetching data from USGS Water API:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch USGS water data.');
  }
};

// We export the function so it can be used by our route handlers.
module.exports = { getUsgsWaterData };

// ---