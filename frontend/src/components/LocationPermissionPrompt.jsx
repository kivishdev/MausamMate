// File: frontend/src/components/LocationPermissionPrompt.jsx
// Purpose: Explicit location permission request component

import { MapPin, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function LocationPermissionPrompt() {
  const { requestLocationPermission, locationPermissionState, isLoading, error } = useWeatherStore();

  const handleAllowLocation = () => {
    console.log('User clicked Allow Location button');
    requestLocationPermission();
  };

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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-700 font-medium mb-2">
              📍 Browser Permission Required
            </p>
            <p className="text-xs text-yellow-600">
              Please look for the location permission popup in your browser (usually near the address bar) and click <strong>"Allow"</strong>
            </p>
          </div>
        </div>
      ) : locationPermissionState === 'denied' || error ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">Location Access Denied</span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-xs font-medium text-blue-800 mb-2">
              🔧 How to enable location access:
            </p>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Look for the <strong>🔒</strong> or <strong>📍</strong> icon in your browser's address bar</li>
              <li>Click on it and select <strong>"Allow"</strong> for location</li>
              <li>Click the button below to try again</li>
            </ol>
          </div>
          
          <button 
            onClick={handleAllowLocation}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <button 
            onClick={handleAllowLocation}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:scale-98 transition-all font-medium flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <MapPin size={20} />
            {isLoading ? 'Requesting...' : 'Allow Location Access'}
          </button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-3 flex items-center justify-center gap-1">
          <Search size={14} />
          Don't want to share location? You can search manually for your city using the search bar above.
        </p>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
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