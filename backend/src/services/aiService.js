// File: backend/src/services/aiService.js (UPDATED WITH LATEST GEMINI SDK)
// Enhanced weather service with latest Gemini SDK and USGS water data integration
const { GoogleGenAI } = require("@google/genai");
const { getOpenMeteoWeather } = require("./openMeteoService");
const { getUsgsWaterData } = require("./usgsWaterService");

// Initialize the latest Google AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Get location name from coordinates (reverse geocoding)
const getLocationName = async (lat, lon) => {
  try {
    const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const geoData = await geoResponse.json();
    return geoData.city || geoData.locality || geoData.principalSubdivision || `Location (${lat}, ${lon})`;
  } catch (error) {
    console.log("Could not fetch location name, using coordinates");
    return `Location (${lat}, ${lon})`;
  }
};

// Find nearby USGS water monitoring stations
const getNearbyUsgsStations = async (lat, lon, radiusKm = 50) => {
  const majorStations = [
    { id: "01646500", name: "Potomac River at Great Falls, MD", lat: 39.0003, lon: -77.2528 },
    { id: "14211720", name: "Willamette River at Portland, OR", lat: 45.5152, lon: -122.6784 },
    { id: "08074500", name: "Buffalo Bayou at Houston, TX", lat: 29.7604, lon: -95.3698 },
    { id: "04087000", name: "Milwaukee River at Milwaukee, WI", lat: 43.0389, lon: -87.9065 },
    { id: "12358500", name: "Clark Fork at Missoula, MT", lat: 46.8721, lon: -113.9940 }
  ];
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  const nearbyStations = majorStations
    .map(station => ({
      ...station,
      distance: calculateDistance(lat, lon, station.lat, station.lon)
    }))
    .filter(station => station.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
  
  return nearbyStations;
};

// Fetch water data for multiple stations
const getWaterDataForStations = async (stations) => {
  const waterDataPromises = stations.map(async (station) => {
    try {
      const data = await getUsgsWaterData(station.id);
      return { station: station, data: data, status: 'success' };
    } catch (error) {
      console.log(`Failed to fetch data for station ${station.id}:`, error.message);
      return { station: station, data: null, status: 'failed', error: error.message };
    }
  });
  
  return Promise.all(waterDataPromises);
};

// Enhanced weather response with conversation memory and USGS integration
const getAiWeatherResponse = async (question, lat, lon, isFirstQuestion = true) => {
  // Support both coordinate input and location-based geocoding from OpenMeteo
  let weatherData;
  let locationName;
  
  if (lat && lon) {
    // Direct coordinates provided
    weatherData = await getOpenMeteoWeather({ lat, lon });
    locationName = await getLocationName(lat, lon);
  } else {
    // This assumes your OpenMeteo service can handle location names and geocoding
    // Adjust this based on your actual openMeteoService implementation
    weatherData = await getOpenMeteoWeather(question);
    locationName = weatherData.locationName || "Unknown Location";
  }
  
  // Fetch nearby water data for US locations
  let waterInfo = "No nearby water monitoring stations found";
  try {
    if (lat && lon) {
      const nearbyStations = await getNearbyUsgsStations(lat, lon);
      if (nearbyStations.length > 0) {
        const waterDataResults = await getWaterDataForStations(nearbyStations);
        const successfulResults = waterDataResults.filter(result => result.status === 'success');
        if (successfulResults.length > 0) {
          waterInfo = successfulResults;
        }
      }
    }
  } catch (error) {
    console.log("Error fetching water data:", error.message);
  }
  
  let enhancedPrompt;
  
  if (isFirstQuestion) {
    // FIRST QUESTION: Give overview + answer specific question
    enhancedPrompt = `You are MausamMate, an intelligent Indian weather assistant with access to comprehensive OpenMeteo weather data and USGS water monitoring data including current conditions, hourly forecasts, temperature trends, precipitation, humidity, wind patterns, visibility, pressure, UV index, and real-time water levels/flow data.

**LOCATION:** ${locationName}
**COMPLETE OPENMETEO WEATHER DATA:** ${JSON.stringify(weatherData, null, 2)}
**USGS WATER MONITORING DATA:** ${JSON.stringify(waterInfo, null, 2)}
**USER'S FIRST QUESTION:** "${question}"

**RESPONSE STRATEGY:**
1. **SHORT QUESTIONS** → Brief, emoji-rich answers (1-2 lines)
2. **DETAILED QUESTIONS** → Comprehensive analysis using ALL available OpenMeteo and USGS data
3. **PLANNING QUESTIONS** → Structured breakdown with timings and recommendations
4. **WATER-RELATED QUESTIONS** → Include relevant water level/flow data from nearby monitoring stations

**ANALYZE THE QUESTION TYPE:**
- Simple: "Baarish hogi?" → Quick answer with timing
- Detailed: "Aaj ka weather kaisa rahega?" → Full day breakdown
- Planning: "Picnic plan kar rahe hain" → Structured analysis with recommendations
- Water-related: "Flooding risk?", "River conditions?" → Include USGS water data analysis

**FOR DETAILED RESPONSES, USE THIS STRUCTURE:**
📍 **${locationName} Weather Overview**
🌡️ **Temperature**: [Current & feels-like, hourly trends]
🌧️ **Precipitation**: [Rain timing, intensity, probability]
💨 **Wind**: [Speed, direction, gusts]
☀️ **Conditions**: [Sky, visibility, UV index]
🌊 **Water Conditions**: [USGS data if relevant - river levels, flow rates]
📊 **Comfort Levels**: [Humidity, pressure, air quality if available]
⏰ **Hourly Breakdown**: [Key changes throughout day]
💡 **Recommendations**: [Activity suggestions, clothing, precautions, flood warnings if applicable]

**RESPONSE RULES:**
- ALWAYS start your response by mentioning the location name: "📍 ${locationName} mein..."
- Use ALL relevant OpenMeteo data points for comprehensive questions
- Include USGS water data when discussing flooding, river conditions, or water activities
- Keep simple questions short with emojis
- Be specific with timings: "10 AM se 2 PM tak", "raat 11 baje ke baad"  
- Include data explanations: "humidity 85% (very sticky)", "river flow 15,000 cfs (above normal)"
- Use natural Hinglish with proper weather and water terminology
- Alert about potential flooding if water levels are unusually high

Determine if this question needs a SHORT or DETAILED response and reply accordingly.`;
  } else {
    // SUBSEQUENT QUESTIONS: Contextual responses
    enhancedPrompt = `You are MausamMate with complete access to OpenMeteo weather data and USGS water monitoring data including temperature, precipitation, wind, humidity, pressure, UV index, visibility, hourly forecasts, and real-time water levels/flow rates.

**LOCATION:** ${locationName}
**COMPLETE OPENMETEO DATA:** ${JSON.stringify(weatherData, null, 2)}
**USGS WATER DATA:** ${JSON.stringify(waterInfo, null, 2)}
**USER QUESTION:** "${question}"

**RESPONSE STRATEGY - ANALYZE QUESTION COMPLEXITY:**

**SIMPLE/QUICK QUESTIONS** → Brief answers (1 line):
- "Baarish hogi?" → "🌧️ Haan, 4-6 PM moderate shower!"
- "Garmi hai?" → "🌡️ 35°C abhi, bohot garmi!"
- "River safe hai?" → "🌊 Water level normal, safe for activities!"

**DETAILED/PLANNING QUESTIONS** → Comprehensive breakdown:
- "Aaj weather kaisa rahega?" → Full day analysis
- "Trip plan kar rahe" → Structured recommendations
- "Flooding ka risk?" → Weather + water level analysis
- "River activities safe?" → Combined weather and water conditions

**FOR DETAILED RESPONSES, STRUCTURE AS:**
🌡️ **Key Info**: [Most relevant weather data]
🌊 **Water Status**: [USGS data if relevant]
⏰ **Timing**: [When conditions change]  
📊 **Details**: [Supporting data from OpenMeteo and USGS]
💡 **Advice**: [Practical recommendations including water safety]

**RESPONSE RULES:**
- ALWAYS start your response by clearly mentioning the location: "📍 ${locationName} mein..."
- Use ALL relevant OpenMeteo data (temperature, rain, wind, humidity, pressure, UV, visibility)
- Include USGS water data for water-related queries or flood assessments
- Match response length to question complexity
- Include precise timings from hourly data
- Add context: "wind 20km/h (strong breeze feeling)", "river flow 25,000 cfs (flood stage approaching)"
- Give practical advice based on comprehensive weather and water data analysis
- Warn about water hazards if conditions are dangerous

Analyze the question and provide appropriate response - short for simple queries, detailed for complex planning or safety questions.`;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: enhancedPrompt,
      config: {
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: isFirstQuestion ? 500 : 400,
        }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error);
    throw new Error("Failed to get response from AI service.");
  }
};

// Advanced weather analysis with multi-day insights and water data
const getWeatherInsights = async (question, lat, lon) => {
  let weatherData;
  let locationName;
  
  if (lat && lon) {
    weatherData = await getOpenMeteoWeather({ lat, lon });
    locationName = await getLocationName(lat, lon);
  } else {
    weatherData = await getOpenMeteoWeather(question);
    locationName = weatherData.locationName || "Unknown Location";
  }
  
  // Fetch water data
  let waterInfo = "No water monitoring data available";
  try {
    if (lat && lon) {
      const nearbyStations = await getNearbyUsgsStations(lat, lon);
      if (nearbyStations.length > 0) {
        const waterDataResults = await getWaterDataForStations(nearbyStations);
        const successfulResults = waterDataResults.filter(result => result.status === 'success');
        if (successfulResults.length > 0) {
          waterInfo = successfulResults;
        }
      }
    }
  } catch (error) {
    console.log("Error fetching water data for insights:", error.message);
  }
  
  const insightPrompt = `As MausamMate, provide detailed weather and water insights for ${locationName}:

**WEATHER DATA:** ${JSON.stringify(weatherData, null, 2)}
**WATER MONITORING DATA:** ${JSON.stringify(waterInfo, null, 2)}
**QUESTION:** "${question}"

**PROVIDE COMPREHENSIVE INSIGHTS ON:**
1. **Current Conditions Summary** (Weather + Water)
2. **Next 6-12 Hours Forecast**
3. **Weather Pattern Analysis**
4. **Water Level/Flow Analysis** (if data available)
5. **Flood Risk Assessment** (combining weather and water data)
6. **Practical Recommendations** (including water safety)
7. **Alerts & Warnings** (weather and water hazards)

Format as structured response with clear sections. Use Hinglish naturally and include specific data points from both weather and water monitoring systems.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: insightPrompt,
      config: {
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1500,
        }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error in weather insights:", error);
    throw new Error("Failed to get weather insights.");
  }
};

// Smart weather recommendations based on activity with water safety considerations
const getActivityRecommendations = async (activity, lat, lon) => {
  let weatherData;
  let locationName;
  
  if (lat && lon) {
    weatherData = await getOpenMeteoWeather({ lat, lon });
    locationName = await getLocationName(lat, lon);
  } else {
    weatherData = await getOpenMeteoWeather(activity);
    locationName = weatherData.locationName || "Unknown Location";
  }
  
  // Fetch water data for water-related activities
  let waterInfo = null;
  const waterActivities = ['swimming', 'boating', 'fishing', 'rafting', 'kayaking', 'paddle', 'river', 'lake', 'beach'];
  const isWaterActivity = waterActivities.some(keyword => activity.toLowerCase().includes(keyword));
  
  if (isWaterActivity && lat && lon) {
    try {
      const nearbyStations = await getNearbyUsgsStations(lat, lon);
      if (nearbyStations.length > 0) {
        const waterDataResults = await getWaterDataForStations(nearbyStations);
        const successfulResults = waterDataResults.filter(result => result.status === 'success');
        if (successfulResults.length > 0) {
          waterInfo = successfulResults;
        }
      }
    } catch (error) {
      console.log("Error fetching water data for activity:", error.message);
    }
  }
  
  const activityPrompt = `User wants to do: "${activity}" in ${locationName}

**CURRENT WEATHER:** ${JSON.stringify(weatherData, null, 2)}
${waterInfo ? `**WATER CONDITIONS:** ${JSON.stringify(waterInfo, null, 2)}` : ''}

As MausamMate, analyze if this activity is suitable for current weather and water conditions, then provide:
1. **Suitability Score** (1-10) - considering both weather and water safety
2. **Best Time Today** for this activity
3. **What to Wear/Bring** - include water safety gear if needed
4. **Weather Considerations**
5. **Water Safety Notes** (if applicable - flow rates, water levels, hazards)
6. **Alternative Suggestions** if conditions aren't ideal

${isWaterActivity ? 'IMPORTANT: Include detailed water safety analysis using USGS data - flow rates, water levels, and any hazards.' : ''}

Respond in helpful Hinglish with practical advice prioritizing safety.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: activityPrompt,
      config: {
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1000,
        }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error in activity recommendations:", error);
    throw new Error("Failed to get activity recommendations.");
  }
};

// Weather and water conditions comparison
const getWeatherComparison = async (question, lat, lon) => {
  let weatherData;
  let locationName;
  
  if (lat && lon) {
    weatherData = await getOpenMeteoWeather({ lat, lon });
    locationName = await getLocationName(lat, lon);
  } else {
    weatherData = await getOpenMeteoWeather(question);
    locationName = weatherData.locationName || "Unknown Location";
  }
  
  // Fetch water data for comprehensive comparison
  let waterInfo = "No water monitoring data available";
  try {
    if (lat && lon) {
      const nearbyStations = await getNearbyUsgsStations(lat, lon);
      if (nearbyStations.length > 0) {
        const waterDataResults = await getWaterDataForStations(nearbyStations);
        const successfulResults = waterDataResults.filter(result => result.status === 'success');
        if (successfulResults.length > 0) {
          waterInfo = successfulResults;
        }
      }
    }
  } catch (error) {
    console.log("Error fetching water data for comparison:", error.message);
  }
  
  const comparisonPrompt = `Compare weather and water conditions for the user's question: "${question}" in ${locationName}

**WEATHER DATA:** ${JSON.stringify(weatherData, null, 2)}
**WATER MONITORING DATA:** ${JSON.stringify(waterInfo, null, 2)}

Analyze and compare:
- **Morning vs Evening** (weather and water conditions)
- **Today vs Tomorrow** (if data available)
- **Hourly variations** (weather patterns)
- **Temperature trends**
- **Precipitation patterns**
- **Water Level/Flow Trends** (if available)
- **Safety Conditions** throughout different times

Provide clear comparisons in Hinglish with specific recommendations prioritizing safety for both weather and water-related activities.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: comparisonPrompt,
      config: {
        generationConfig: {
          temperature: 0.5, // More factual for comparisons
          maxOutputTokens: 1200,
        }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error in weather comparison:", error);
    throw new Error("Failed to get weather comparison.");
  }
};

// New function: Flood risk assessment combining weather and water data
const getFloodRiskAssessment = async (lat, lon) => {
  let weatherData;
  let locationName;
  
  if (lat && lon) {
    weatherData = await getOpenMeteoWeather({ lat, lon });
    locationName = await getLocationName(lat, lon);
  } else {
    throw new Error("Coordinates required for flood risk assessment");
  }
  
  let waterInfo = "No water monitoring data available";
  try {
    const nearbyStations = await getNearbyUsgsStations(lat, lon, 100); // Wider radius for flood assessment
    if (nearbyStations.length > 0) {
      const waterDataResults = await getWaterDataForStations(nearbyStations);
      const successfulResults = waterDataResults.filter(result => result.status === 'success');
      if (successfulResults.length > 0) {
        waterInfo = successfulResults;
      }
    }
  } catch (error) {
    console.log("Error fetching water data for flood assessment:", error.message);
  }
  
  const floodPrompt = `Provide comprehensive flood risk assessment for ${locationName}:

**WEATHER DATA:** ${JSON.stringify(weatherData, null, 2)}
**WATER MONITORING DATA:** ${JSON.stringify(waterInfo, null, 2)}

Analyze and provide:
1. **Current Flood Risk Level** (Low/Moderate/High/Severe)
2. **Contributing Factors** (rainfall, water levels, flow rates)
3. **Timeline Assessment** (next 6-24 hours)
4. **Areas of Concern** (based on water monitoring stations)
5. **Safety Recommendations**
6. **Emergency Preparedness** (if risk is elevated)

Use both weather forecast and real-time water data to make assessment. Be specific about risk levels and timing.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: floodPrompt,
      config: {
        generationConfig: {
          temperature: 0.3, // Very factual for safety assessment
          maxOutputTokens: 1000,
        }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error in flood risk assessment:", error);
    throw new Error("Failed to get flood risk assessment.");
  }
};

// Export all functions
module.exports = { 
  getAiWeatherResponse,
  getWeatherInsights,
  getActivityRecommendations,
  getWeatherComparison,
  getFloodRiskAssessment,
  getNearbyUsgsStations, // Export for potential direct use
  getWaterDataForStations // Export for potential direct use
};