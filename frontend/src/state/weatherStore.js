// File: frontend/src/state/weatherStore.js
// Purpose: Enhanced version with improved location handling and new features

import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useWeatherStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // --- STATE ---
        location: null,
        searchResults: [],
        weatherData: null,
        aiResponse: "Hello! Ask me anything about the weather...",
        sessionId: null,
        isLoading: true,
        isChatLoading: false,
        error: null,
        locationPermissionState: null,
        
        // NEW ENHANCED LOCATION FEATURES
        recentLocations: [], // Store recently searched locations
        favoriteLocations: [], // User's saved favorite locations
        locationHistory: [], // Track location changes for analytics
        isLocationWatching: false, // Track if actively watching position
        locationAccuracy: null, // GPS accuracy in meters
        lastLocationUpdate: null, // Timestamp of last location update
        ipLocationData: null, // Fallback IP-based location
        locationSuggestions: [], // Smart suggestions based on user patterns
        nearbyLocations: [], // Points of interest near current location

        // --- ENHANCED LOCATION ACTIONS ---

        /**
         * Enhanced location permission with better UX and caching
         */
        requestLocationPermission: async () => {
          console.log('🔍 Requesting enhanced location permission...');
          set({ locationPermissionState: 'pending', isLoading: true, error: null });

          // Check if permission was previously denied (stored in localStorage)
          const permissionPreviouslyDenied = localStorage.getItem('location-permission-denied') === 'true';
          
          if (permissionPreviouslyDenied) {
            set({
              locationPermissionState: 'denied',
              error: 'Location was previously denied. Please enable in browser settings or search manually.',
              isLoading: false
            });
            return false;
          }

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

            // Enhanced getCurrentPosition with better options
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                console.log('✅ Location permission granted');
                const { latitude, longitude, accuracy } = position.coords;
                
                localStorage.removeItem('location-permission-denied'); // Clear any previous denial
                
                set({ 
                  locationPermissionState: 'granted',
                  locationAccuracy: accuracy,
                  lastLocationUpdate: new Date().toISOString()
                });
                
                await get().processNewLocation(latitude, longitude, 'gps');
                resolve(true);
              },
              (error) => {
                console.error('❌ Geolocation error:', error);
                
                // Store denial in localStorage to avoid repeated prompts
                if (error.code === error.PERMISSION_DENIED) {
                  localStorage.setItem('location-permission-denied', 'true');
                }
                
                const errorDetails = get().getLocationErrorDetails(error);
                set({ 
                  locationPermissionState: errorDetails.state,
                  error: errorDetails.message,
                  isLoading: false 
                });
                
                // Try IP location as fallback
                get().tryIpLocationFallback();
                resolve(false);
              },
              {
                timeout: 10000,
                enableHighAccuracy: true,
                maximumAge: 5 * 60 * 1000 // Cache for 5 minutes
              }
            );
          });
        },

        /**
         * Process a new location from any source (GPS, search, IP)
         */
        processNewLocation: async (lat, lon, source = 'unknown') => {
          try {
            console.log(`🌍 Processing new location: [${lat}, ${lon}] from ${source}`);
            
            // Get detailed location info
            const locationInfo = await get().reverseGeocode(lat, lon);
            const location = { 
              ...locationInfo, 
              lat, 
              lon, 
              source,
              timestamp: new Date().toISOString()
            };
            
            // Update location history
            const { locationHistory } = get();
            const newHistory = [location, ...locationHistory.slice(0, 9)]; // Keep last 10
            
            set({ 
              location,
              locationHistory: newHistory,
              sessionId: null,
              aiResponse: "Hello! Ask me anything about the weather..."
            });
            
            // Fetch weather and nearby locations
            await Promise.all([
              get().fetchWeatherForCoordinates(lat, lon),
              get().fetchNearbyLocations(lat, lon)
            ]);
            
            // Add to recent locations if from search
            if (source === 'search') {
              get().addToRecentLocations(location);
            }
            
          } catch (err) {
            console.error('Failed to process new location:', err);
            set({ 
              error: 'Failed to process location data. Please try again.',
              isLoading: false 
            });
          }
        },

        /**
         * Enhanced reverse geocoding with multiple fallbacks
         */
        reverseGeocode: async (lat, lon) => {
          try {
            // Primary: BigDataCloud (free, good coverage)
            const bdcResponse = await axios.get(
              `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&localityLanguage=en&key=${import.meta.env.VITE_BDC_API_KEY}`
            );
            
            return {
              name: bdcResponse.data.city || bdcResponse.data.locality || 'Unknown Location',
              city: bdcResponse.data.city,
              country: bdcResponse.data.countryName,
              countryCode: bdcResponse.data.countryCode,
              region: bdcResponse.data.principalSubdivision,
              timezone: bdcResponse.data.timezone
            };
            
          } catch (bdcError) {
            console.warn('BDC geocoding failed, trying fallback...', bdcError.message);
            
            try {
              // Fallback: OpenStreetMap Nominatim (free but rate limited)
              const nomResponse = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
              );
              
              const addr = nomResponse.data.address || {};
              return {
                name: addr.city || addr.town || addr.village || 'Unknown Location',
                city: addr.city || addr.town || addr.village,
                country: addr.country,
                countryCode: addr.country_code?.toUpperCase(),
                region: addr.state || addr.region
              };
              
            } catch (fallbackError) {
              console.warn('All reverse geocoding failed:', fallbackError.message);
              return { name: 'Current Location' };
            }
          }
        },

        /**
         * Try IP-based location as fallback when GPS fails
         */
        tryIpLocationFallback: async () => {
          try {
            console.log('🌐 Attempting IP-based location fallback...');
            set({ isLoading: true });
            
            // Using ipapi.co (free tier available)
            const ipResponse = await axios.get('https://ipapi.co/json/');
            const { latitude, longitude, city, country_name, region } = ipResponse.data;
            
            if (latitude && longitude) {
              const location = {
                name: `${city}, ${region}`,
                lat: latitude,
                lon: longitude,
                city,
                country: country_name,
                source: 'ip',
                timestamp: new Date().toISOString()
              };
              
              set({ 
                ipLocationData: location,
                location,
                sessionId: null,
                aiResponse: `Based on your approximate location (${city}), ask me anything about the weather...`
              });
              
              await get().fetchWeatherForCoordinates(latitude, longitude);
              console.log(`📍 IP location fallback successful: ${city}`);
            }
            
          } catch (ipError) {
            console.error('IP location fallback failed:', ipError.message);
            set({ 
              error: 'Unable to determine your location. Please search for your city manually.',
              isLoading: false 
            });
          }
        },

        /**
         * Watch user's position continuously (for mobile apps)
         */
        startLocationWatching: () => {
          if (!navigator.geolocation || get().isLocationWatching) return;
          
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude, accuracy } = position.coords;
              const { location } = get();
              
              // Only update if moved significantly (> 1km) or accuracy improved significantly
              if (!location || 
                  get().calculateDistance(location.lat, location.lon, latitude, longitude) > 1 ||
                  (accuracy < (get().locationAccuracy || Infinity) / 2)) {
                
                console.log(`📱 Location updated via watching: [${latitude}, ${longitude}] (±${accuracy}m)`);
                get().processNewLocation(latitude, longitude, 'watch');
              }
            },
            (error) => console.warn('Location watching error:', error.message),
            { enableHighAccuracy: false, maximumAge: 30000 } // Less aggressive for battery
          );
          
          set({ isLocationWatching: watchId });
        },

        stopLocationWatching: () => {
          const { isLocationWatching } = get();
          if (isLocationWatching) {
            navigator.geolocation.clearWatch(isLocationWatching);
            set({ isLocationWatching: false });
          }
        },

        /**
         * Enhanced location search with suggestions and autocomplete
         */
        fetchDataForLocation: async (placeName) => {
          if (!placeName.trim()) {
            set({ searchResults: [] });
            return;
          }

          set({ error: null });
          
          try {
            // Get smart suggestions first (instant)
            const suggestions = get().getLocationSuggestions(placeName);
            if (suggestions.length > 0) {
              set({ searchResults: suggestions.slice(0, 3) }); // Show top 3 suggestions immediately
            }
            
            // Then fetch from API
            console.log(`Searching for location: ${placeName}`);
            const geocodeRes = await axios.get(`${API_BASE_URL}/api/geocode?place=${encodeURIComponent(placeName)}`);
            const locationData = geocodeRes.data;

            // Enhance results with additional info
            const enhancedResults = locationData.map(loc => ({
              ...loc,
              isFavorite: get().favoriteLocations.some(fav => 
                Math.abs(fav.lat - loc.lat) < 0.01 && Math.abs(fav.lon - loc.lon) < 0.01
              ),
              isRecent: get().recentLocations.some(recent => 
                Math.abs(recent.lat - loc.lat) < 0.01 && Math.abs(recent.lon - loc.lon) < 0.01
              )
            }));

            set({ searchResults: enhancedResults });

          } catch (err) {
            console.error("Failed to fetch data for location:", err);
            set({ 
              searchResults: [],
              error: `Could not find locations for "${placeName}". Please try another search.`
            });
          }
        },

        /**
         * Get smart location suggestions based on user patterns
         */
        getLocationSuggestions: (query) => {
          const { recentLocations, favoriteLocations, locationHistory } = get();
          const allSuggestions = [...favoriteLocations, ...recentLocations, ...locationHistory];
          
          return allSuggestions
            .filter(loc => 
              loc.name?.toLowerCase().includes(query.toLowerCase()) ||
              loc.city?.toLowerCase().includes(query.toLowerCase())
            )
            .sort((a, b) => {
              // Prioritize favorites, then recent, then by timestamp
              if (a.isFavorite && !b.isFavorite) return -1;
              if (!a.isFavorite && b.isFavorite) return 1;
              return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
            })
            .slice(0, 5);
        },

        /**
         * Fetch nearby points of interest
         */
        fetchNearbyLocations: async (lat, lon) => {
          try {
            // This could integrate with places API to show nearby cities, landmarks, etc.
            const nearbyResponse = await axios.get(
              `https://api.bigdatacloud.net/data/reverse-geocode-detailed?latitude=${lat}&longitude=${lon}&key=${import.meta.env.VITE_BDC_API_KEY}`
            );
            
            // Extract nearby localities from the detailed response
            const nearby = nearbyResponse.data.localityInfo?.administrative || [];
            const nearbyLocations = nearby
              .filter(item => item.name && item.name !== get().location?.name)
              .slice(0, 5)
              .map(item => ({
                name: item.name,
                type: 'nearby',
                distance: get().calculateDistance(lat, lon, item.latitude || lat, item.longitude || lon)
              }));
            
            set({ nearbyLocations });
            
          } catch (nearbyError) {
            console.warn('Failed to fetch nearby locations:', nearbyError.message);
          }
        },

        // --- FAVORITES AND RECENTS MANAGEMENT ---

        addToFavorites: (location) => {
          const { favoriteLocations } = get();
          const isAlreadyFavorite = favoriteLocations.some(fav => 
            Math.abs(fav.lat - location.lat) < 0.01 && Math.abs(fav.lon - location.lon) < 0.01
          );
          
          if (!isAlreadyFavorite) {
            const newFavorites = [...favoriteLocations, { ...location, isFavorite: true }];
            set({ favoriteLocations: newFavorites });
          }
        },

        removeFromFavorites: (location) => {
          const { favoriteLocations } = get();
          const newFavorites = favoriteLocations.filter(fav => 
            !(Math.abs(fav.lat - location.lat) < 0.01 && Math.abs(fav.lon - location.lon) < 0.01)
          );
          set({ favoriteLocations: newFavorites });
        },

        addToRecentLocations: (location) => {
          const { recentLocations } = get();
          const filtered = recentLocations.filter(recent => 
            !(Math.abs(recent.lat - location.lat) < 0.01 && Math.abs(recent.lon - location.lon) < 0.01)
          );
          const newRecents = [location, ...filtered].slice(0, 10); // Keep last 10
          set({ recentLocations: newRecents });
        },

        clearRecentLocations: () => set({ recentLocations: [] }),

        // --- UTILITY FUNCTIONS ---

        getLocationErrorDetails: (error) => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              return {
                state: 'denied',
                message: '🚫 Location access denied. Enable location permissions and refresh, or search manually.'
              };
            case error.POSITION_UNAVAILABLE:
              return {
                state: 'unavailable',  
                message: '📍 Location unavailable. Check GPS settings or search manually.'
              };
            case error.TIMEOUT:
              return {
                state: 'denied',
                message: '⏰ Location request timed out. Try again or search manually.'
              };
            default:
              return {
                state: 'denied',
                message: '🌍 Unable to access location. Please search manually.'
              };
          }
        },

        calculateDistance: (lat1, lon1, lat2, lon2) => {
          const R = 6371; // Earth's radius in km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                   Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                   Math.sin(dLon/2) * Math.sin(dLon/2);
          return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * R;
        },

        // --- EXISTING METHODS (unchanged) ---
        fetchWeatherForCoordinates: async (lat, lon) => {
          try {
            const currentSessionId = null;
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

        selectLocation: async (selectedLocation) => {
          console.log('Selected location:', selectedLocation);
          
          set({ 
            searchResults: [], 
            location: selectedLocation, 
            isLoading: true, 
            error: null,
            sessionId: null,
            aiResponse: "Hello! Ask me anything about the weather..."
          });
          
          try {
            const lat = parseFloat(selectedLocation.lat);
            const lon = parseFloat(selectedLocation.lon);
            
            if (isNaN(lat) || isNaN(lon)) {
              throw new Error('Invalid coordinates received from location data');
            }

            await get().processNewLocation(lat, lon, 'search');
            
          } catch (err) {
            console.error("Failed to fetch weather for selected location:", err);
            set({ 
              error: `Could not fetch weather data for ${selectedLocation.name}. Please try again.`, 
              isLoading: false 
            });
          }
        },

        clearSearchResults: () => set({ searchResults: [] }),

        resetChatSession: () => {
          set({
            sessionId: null,
            aiResponse: "Hello! Ask me anything about the weather..."
          });
        },

        fetchInitialData: async () => {
          console.log('🚀 Enhanced app starting - requesting location permission...');
          const locationGranted = await get().requestLocationPermission();
          
          if (!locationGranted) {
            console.log('📍 Browser location not available, app ready for manual search');
            set({
              isLoading: false,
              error: null
            });
          }
        },
      }),
      {
        name: 'weather-store',
        partialize: (state) => ({
          favoriteLocations: state.favoriteLocations,
          recentLocations: state.recentLocations,
          locationHistory: state.locationHistory.slice(0, 5), // Only persist recent history
        })
      }
    )
  )
);