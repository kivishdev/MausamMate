// File: frontend/src/components/LocationPermissionPrompt.jsx
// Purpose: Enhanced location permission request component with better UX

import { MapPin, Search, AlertCircle, RefreshCw, Shield, Zap, Clock } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function LocationPermissionPrompt() {
  const { 
    requestLocationPermission, 
    locationPermissionState, 
    isLoading, 
    error 
  } = useWeatherStore();

  const handleAllowLocation = () => {
    console.log('User clicked Allow Location button');
    requestLocationPermission();
  };

  const benefits = [
    {
      icon: <Zap className="text-yellow-500" size={16} />,
      text: "Instant accurate weather for your exact location"
    },
    {
      icon: <Clock className="text-blue-500" size={16} />,
      text: "Real-time weather alerts and notifications"
    },
    {
      icon: <Shield className="text-green-500" size={16} />,
      text: "Personalized weather recommendations"
    }
  ];

  return (
    <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-blue-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-50 to-transparent rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <MapPin size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Enable Location Access
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Get hyper-accurate weather data tailored to your exact location for the best MausamMate experience.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-6 space-y-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-left bg-gray-50 p-3 rounded-lg">
              {benefit.icon}
              <span className="text-sm text-gray-700">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Permission Status Handling */}
        {locationPermissionState === 'pending' && isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 p-4 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm font-medium">Waiting for location permission...</span>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs text-yellow-700 font-medium mb-1">
                    📍 Browser Permission Required
                  </p>
                  <p className="text-xs text-yellow-600">
                    Please look for the location permission popup in your browser (usually near the address bar) and click <strong>"Allow"</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : locationPermissionState === 'denied' || error ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">Location Access Denied</span>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-xs font-medium text-blue-800 mb-3 flex items-center gap-1">
                <span>🔧</span> How to enable location access:
              </p>
              <ol className="text-xs text-blue-700 space-y-2 list-decimal list-inside">
                <li>Look for the <strong>🔒</strong> or <strong>📍</strong> icon in your browser's address bar</li>
                <li>Click on it and select <strong>"Allow"</strong> for location</li>
                <li>Refresh the page or click the button below to try again</li>
              </ol>
            </div>
            
            {/* Browser-specific instructions */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Alternative methods:</p>
              <ul className="space-y-1">
                <li>• Chrome: Click the location icon in the address bar</li>
                <li>• Firefox: Look for the shield icon</li>
                <li>• Safari: Check Site Settings in the URL bar</li>
              </ul>
            </div>
            
            <button 
              onClick={handleAllowLocation}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Trying...' : 'Try Again'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={handleAllowLocation}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 active:scale-98 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              <MapPin size={20} />
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Requesting...
                </>
              ) : (
                'Allow Location Access'
              )}
            </button>
          </div>
        )}

        {/* Manual search option */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-2">
            <Search size={14} />
            <span>Don't want to share location?</span>
          </div>
          <p className="text-xs text-gray-400">
            You can search manually for your city using the search bar above.
          </p>
        </div>

        {/* Privacy notice */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <Shield size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs text-green-700 font-medium mb-1">
                🔒 Privacy Protected
              </p>
              <p className="text-xs text-green-600">
                Your location data stays secure on your device and is only used to fetch weather information. We don't store or share your location.
              </p>
            </div>
          </div>
        </div>

        {/* Error display */}
        {error && locationPermissionState !== 'pending' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationPermissionPrompt;