// File: frontend/src/state/weatherStore.js
// Purpose: Fixed version with session reset on location change

import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useWeatherStore = create((set, get) => ({
  // --- STATE ---
  location: null,
  searchResults: [],
  weatherData: null,
  aiResponse: "Hello! Ask me anything about the weather...", // Default message
  sessionId: null,
  isLoading: true,
  isChatLoading: false,
  error: null,

  // --- ACTIONS ---
  fetchWeatherForCoordinates: async (lat, lon) => {
    try {
      // Reset session for new location to get fresh weather data
      const currentSessionId = null; // Force new session for location change

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
        sessionId: sessionId, // New session ID for this location
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
   * Fetches multiple location suggestions from LocationIQ API for search dropdown
   * Only sets searchResults — weather is fetched after user selects a location.
   */
  fetchDataForLocation: async (placeName) => {
    if (!placeName.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ error: null }); // Don't set isLoading here as it's for search suggestions
    try {
      console.log(`Searching for location: ${placeName}`);
      const geocodeRes = await axios.get(`${API_BASE_URL}/api/geocode?place=${encodeURIComponent(placeName)}`);
      const locationData = geocodeRes.data; // Array of locations from LocationIQ

      console.log('Search results received:', locationData);

      set({
        searchResults: locationData,
      });

    } catch (err) {
      console.error("Failed to fetch data for location:", err);
      set({ 
        searchResults: [],
        error: `Could not find locations for "${placeName}". Please try another search.`
      });
    }
  },

  /**
   * When user selects a location from search results dropdown.
   */
  selectLocation: async (selectedLocation) => {
    console.log('Selected location:', selectedLocation);
    
    // Clear search results, reset session, and set loading
    set({ 
      searchResults: [], 
      location: selectedLocation, 
      isLoading: true, 
      error: null,
      sessionId: null, // Reset session for new location
      aiResponse: "Hello! Ask me anything about the weather..." // Reset to default
    });
    
    try {
      // Ensure lat and lon are numbers
      const lat = parseFloat(selectedLocation.lat);
      const lon = parseFloat(selectedLocation.lon);
      
      if (isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid coordinates received from location data');
      }

      await get().fetchWeatherForCoordinates(lat, lon);
      
    } catch (err) {
      console.error("Failed to fetch weather for selected location:", err);
      set({ 
        error: `Could not fetch weather data for ${selectedLocation.name}. Please try again.`, 
        isLoading: false 
      });
    }
  },

  clearSearchResults: () => set({ searchResults: [] }),

  /**
   * Reset chat session (useful for clearing conversation history)
   */
  resetChatSession: () => {
    set({
      sessionId: null,
      aiResponse: "Hello! Ask me anything about the weather..."
    });
  },

  /**
   * Fetches initial data when the app loads - with better geolocation handling
   */
  fetchInitialData: () => {
    set({ isLoading: true, error: null });

    const fetchByIp = async () => {
      console.log("GPS failed or was blocked. Falling back to IP-based location.");
      try {
        const locationRes = await axios.get(`${API_BASE_URL}/api/location`);
        const locationData = locationRes.data;
        
        const location = { 
          name: locationData.city || locationData.region || 'Your Location', 
          lat: locationData.lat, 
          lon: locationData.lon 
        };
        
        set({ 
          location,
          sessionId: null, // Reset session for initial location
          aiResponse: "Hello! Ask me anything about the weather..."
        });
        await get().fetchWeatherForCoordinates(locationData.lat, locationData.lon);
        
      } catch (err) {
        console.error("IP-based location also failed:", err);
        set({ 
          error: 'Could not detect your location. Please use the search bar to find your city.', 
          isLoading: false 
        });
      }
    };

    // Check if geolocation is available and HTTPS
    if (!navigator.geolocation) {
      console.log("Browser does not support geolocation.");
      fetchByIp();
      return;
    }

    // Check if we're on HTTPS (required for geolocation in modern browsers)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.warn('Geolocation requires HTTPS. Falling back to IP location.');
      fetchByIp();
      return;
    }

    // Request geolocation with timeout and better error handling
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`GPS location found: [${latitude}, ${longitude}]`);
        
        try {
          // Get city name from coordinates
          const geoResponse = await axios.get(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          const cityName = geoResponse.data.city || 
                          geoResponse.data.locality || 
                          geoResponse.data.principalSubdivision || 
                          'Current Location';
                          
          const location = { name: cityName, lat: latitude, lon: longitude };
          set({ 
            location,
            sessionId: null, // Reset session for GPS location
            aiResponse: "Hello! Ask me anything about the weather..."
          });
          
          await get().fetchWeatherForCoordinates(latitude, longitude);
          
        } catch (reverseGeoError) {
          console.error('Reverse geocoding failed:', reverseGeoError);
          // Still use the coordinates even if city name lookup fails
          const location = { name: 'Current Location', lat: latitude, lon: longitude };
          set({ 
            location,
            sessionId: null,
            aiResponse: "Hello! Ask me anything about the weather..."
          });
          await get().fetchWeatherForCoordinates(latitude, longitude);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        
        let errorMessage = 'Location access ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'was denied. Using IP location instead.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'is unavailable. Using IP location instead.';
            break;
          case error.TIMEOUT:
            errorMessage += 'timed out. Using IP location instead.';
            break;
          default:
            errorMessage += 'failed. Using IP location instead.';
            break;
        }
        
        console.log(errorMessage);
        fetchByIp();
      },
      {
        timeout: 10000, // 10 second timeout
        enableHighAccuracy: false, // Faster response
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  },
}));