// File: frontend/src/state/weatherStore.js
// Purpose: Fixed version with MANDATORY browser location permission

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
  locationPermissionState: null, // 'pending', 'granted', 'denied', 'unavailable'

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
   * Force request for browser location permission
   */
  requestLocationPermission: async () => {
    console.log('🔍 Requesting browser location permission...');
    set({ locationPermissionState: 'pending', isLoading: true, error: null });

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('❌ Browser does not support geolocation');
        set({ 
          locationPermissionState: 'unavailable',
          error: 'Your browser does not support location services. Please use the search bar to find your city.',
          isLoading: false 
        });
        resolve(false);
        return;
      }

      // Always request fresh permission by calling getCurrentPosition
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('✅ Location permission granted');
          const { latitude, longitude } = position.coords;
          
          set({ locationPermissionState: 'granted' });
          
          try {
            // Get city name from coordinates
            console.log(`🌍 Getting city name for coordinates: [${latitude}, ${longitude}]`);
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
            
            console.log(`🏙️ Location detected: ${cityName} [${latitude}, ${longitude}]`);
            await get().fetchWeatherForCoordinates(latitude, longitude);
            
            resolve(true);
            
          } catch (reverseGeoError) {
            console.error('🚨 Reverse geocoding failed:', reverseGeoError);
            // Still use the coordinates even if city name lookup fails
            const location = { name: 'Current Location', lat: latitude, lon: longitude };
            set({ 
              location,
              sessionId: null,
              aiResponse: "Hello! Ask me anything about the weather..."
            });
            await get().fetchWeatherForCoordinates(latitude, longitude);
            resolve(true);
          }
        },
        (error) => {
          console.error('❌ Geolocation permission denied or failed:', error);
          
          let errorMessage = '';
          let permissionState = 'denied';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '🚫 Location access was denied. Please enable location permissions in your browser settings and refresh the page, or use the search bar to find your city.';
              permissionState = 'denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '📍 Your location is currently unavailable. Please check your GPS settings or use the search bar to find your city.';
              permissionState = 'unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = '⏰ Location request timed out. Please try again or use the search bar to find your city.';
              permissionState = 'denied';
              break;
            default:
              errorMessage = '🌍 Unable to access your location. Please use the search bar to find your city.';
              permissionState = 'denied';
              break;
          }
          
          set({ 
            locationPermissionState: permissionState,
            error: errorMessage,
            isLoading: false 
          });
          
          resolve(false);
        },
        {
          timeout: 15000, // 15 second timeout
          enableHighAccuracy: true, // Request high accuracy to ensure permission prompt
          maximumAge: 0 // Don't use cached location, force fresh permission request
        }
      );
    });
  },

  /**
   * Fetches initial data when the app loads - ALWAYS requests location permission first
   */
  fetchInitialData: async () => {
    console.log('🚀 App starting - requesting location permission...');
    
    // Always try to get browser location permission first
    const locationGranted = await get().requestLocationPermission();
    
    if (!locationGranted) {
      console.log('📍 Browser location not available, but app is ready for manual search');
      // Don't fallback to IP location automatically - let user search manually
      set({
        isLoading: false,
        error: null // Clear error so user can search
      });
    }
  },
}));