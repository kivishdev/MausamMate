// File: frontend/src/components/LocationPermissionPrompt.jsx
// Purpose: Explicit location permission request component

import { MapPin, Search, AlertCircle } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function LocationPermissionPrompt() {
  const { requestLocationPermission, locationPermissionState, isLoading } = useWeatherStore();

  const handleAllowLocation = () => {
    requestLocationPermission();
  };

  if (locationPermissionState === 'granted') {
    return null; // Don't show if permission already granted
  }

  return (
    <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-blue-200">
      <div className="mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={40} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Enable Location Access
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          MausamMate needs your location to provide accurate weather information for your area. 
          This helps us give you personalized weather updates and forecasts.
        </p>
      </div>

      {locationPermissionState === 'pending' && isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm font-medium">Waiting for location permission...</span>
          </div>
          <p className="text-xs text-gray-500">
            Please check your browser's permission popup and click "Allow"
          </p>
        </div>
      ) : locationPermissionState === 'denied' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">Location Access Denied</span>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              To enable location access:
            </p>
            <ol className="text-xs text-gray-600 text-left space-y-1">
              <li>1. Click the location icon 📍 in your browser's address bar</li>
              <li>2. Select "Allow" for location permissions</li>
              <li>3. Refresh this page</li>
            </ol>
            <button 
              onClick={handleAllowLocation}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button 
            onClick={handleAllowLocation}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:scale-98 transition-all font-medium flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <MapPin size={20} />
            Allow Location Access
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 flex items-center justify-center gap-1">
              <Search size={14} />
              Or search manually for your city
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-xs text-green-700 font-medium mb-1">
          🔒 Privacy Protected
        </p>
        <p className="text-xs text-green-600">
          Your location data stays on your device and is only used to fetch weather information.
        </p>
      </div>
    </div>
  );
}

export default LocationPermissionPrompt;