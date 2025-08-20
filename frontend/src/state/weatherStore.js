// File: frontend/src/state/weatherStore.js
// Purpose: This is the final version with all functions, including the corrected AI chat logic.

import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useWeatherStore = create((set, get) => ({
  // --- STATE ---
  location: null,
  weatherData: null,
  aiResponse: "Hello! Ask me anything about the weather...", // Default message
  sessionId: null,
  isLoading: true,
  isChatLoading: false, // New state for the chatbot's loading spinner
  error: null,

  // --- ACTIONS ---
  fetchWeatherForCoordinates: async (lat, lon) => {
    try {
      const currentSessionId = get().sessionId; 

      const aiRes = await axios.post(`${API_BASE_URL}/api/ai`, {
        question: `Give me a detailed weather report for today.`,
        lat: lat,
        lon: lon,
        sessionId: currentSessionId,
      });
      
      const { answer, sessionId } = aiRes.data;
      const weatherRes = await axios.get(`${API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`);

      set({
        aiResponse: answer,
        sessionId: sessionId,
        weatherData: weatherRes.data,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch weather data for coordinates:", err);
      throw err;
    }
  },

  /**
   * Handles questions asked by the user in the chatbot.
   */
  askAi: async (question) => {
    const { location, sessionId } = get();
    if (!location) return;

    set({ isChatLoading: true, error: null });
    try {
      const aiRes = await axios.post(`${API_BASE_URL}/api/ai`, {
        question: question,
        lat: location.lat,
        lon: location.lon,
        sessionId: sessionId,
      });

      const { answer, sessionId: newSessionId } = aiRes.data;

      set({ 
        aiResponse: answer, 
        sessionId: newSessionId, 
        isChatLoading: false 
      });

    } catch (err) {
      console.error("Failed to get AI response:", err);
      set({ error: 'Sorry, I could not get an answer. Please try again.', isChatLoading: false });
    }
  },

  /**
   * Fetches data for a location name provided by the user from the search bar.
   */
  fetchDataForLocation: async (placeName) => {
    set({ isLoading: true, error: null });
    try {
      console.log(`Searching for location: ${placeName}`);
      const geocodeRes = await axios.get(`${API_BASE_URL}/api/geocode?place=${placeName}`);
      const locationData = geocodeRes.data;
      
      set({ location: { name: locationData.name, lat: locationData.lat, lon: locationData.lon } });

      await get().fetchWeatherForCoordinates(locationData.lat, locationData.lon);

    } catch (err) {
      console.error("Failed to fetch data for location:", err);
      set({ error: `Could not find weather for "${placeName}". Please try another location.`, isLoading: false });
    }
  },

  /**
   * Fetches initial data when the app loads.
   */
  fetchInitialData: () => {
    set({ isLoading: true, error: null });

    const fetchByIp = async () => {
      console.log("GPS failed or was blocked. Falling back to IP-based location.");
      try {
        const locationRes = await axios.get(`${API_BASE_URL}/api/location`);
        const locationData = locationRes.data;
        set({ location: { name: locationData.city, lat: locationData.lat, lon: locationData.lon } });
        await get().fetchWeatherForCoordinates(locationData.lat, locationData.lon);
      } catch (err) {
        console.error("IP-based location also failed:", err);
        set({ error: 'Could not detect your location. Please use the search bar.', isLoading: false });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geoResponse = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const cityName = geoResponse.data.city || geoResponse.data.locality || 'Current Location';
            set({ location: { name: cityName, lat: latitude, lon: longitude } });
          } catch {
            set({ location: { name: 'Current Location', lat: latitude, lon: longitude } });
          }
          await get().fetchWeatherForCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          fetchByIp();
        }
      );
    } else {
      console.log("Browser does not support geolocation.");
      fetchByIp();
    }
  },
}));
