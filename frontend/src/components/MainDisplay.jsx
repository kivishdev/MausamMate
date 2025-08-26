// ========================================================================
// File: frontend/src/components/MainDisplay.jsx (ENHANCED VERSION)
// Purpose: Main weather display with modern card design and location status
// ========================================================================
import { ChevronDown, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';
import { getWeatherIcon } from '../utils/weatherUtils.jsx';

function MainDisplay() {
  const { 
    weatherData, 
    location, 
    locationPermissionState,
    requestLocationPermission,
    isLoading 
  } = useWeatherStore();

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-8 rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <RefreshCw size={32} className="animate-spin text-blue-500 mx-auto mb-4" />
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!weatherData || !location) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-8 rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">No location selected</p>
          <p className="text-sm text-gray-400 mb-4">
            Please search for a city or allow location access
          </p>
          {locationPermissionState === 'denied' && (
            <button 
              onClick={requestLocationPermission}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <MapPin size={16} />
              Try Location Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const { current } = weatherData;
  const { icon, description, severity } = getWeatherIcon(current.weather_code);

  // Determine location status
  const getLocationStatus = () => {
    if (locationPermissionState === 'granted' && location.name !== 'Current Location') {
      return { icon: '📍', text: 'GPS Location', color: 'text-green-600' };
    } else if (locationPermissionState === 'granted') {
      return { icon: '🌍', text: 'Current Location', color: 'text-blue-600' };
    } else {
      return { icon: '🔍', text: 'Manual Search', color: 'text-gray-600' };
    }
  };

  const locationStatus = getLocationStatus();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      {/* Header with Date, Time, and Location Status */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {new Date(current.time).toLocaleDateString('en-IN', { weekday: 'long' })}
          </h2>
          <p className="text-gray-500 text-sm">
            {new Date(current.time).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
        </div>
        
        {/* Location with Status */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors group">
            <span className="font-medium text-sm">{location.name}</span>
            <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
          </div>
          
          {/* Location Status Indicator */}
          <div className={`flex items-center gap-1 mt-1 text-xs ${locationStatus.color}`}>
            <span>{locationStatus.icon}</span>
            <span>{locationStatus.text}</span>
          </div>
          
          {/* Weather Severity Alert */}
          {severity === 'high' && (
            <div className="flex items-center gap-1 mt-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <AlertCircle size={10} />
              <span>Weather Alert</span>
            </div>
          )}
        </div>
      </div>

      {/* Temperature and Weather Icon */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start">
          <span className="text-7xl font-light text-gray-800">
            {Math.round(current.temperature_2m)}
          </span>
          <span className="text-3xl font-light text-gray-800 mt-2">°</span>
        </div>
        <div className="scale-150 mt-4">{icon}</div>
      </div>

      {/* Weather Description with Enhanced Info */}
      <div className="mb-8">
        <p className="text-gray-600 capitalize text-lg mb-2">{description}</p>
        {current.apparent_temperature && Math.abs(current.apparent_temperature - current.temperature_2m) > 2 && (
          <p className="text-sm text-gray-500">
            Feels like {Math.round(current.apparent_temperature)}°
          </p>
        )}
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-1 gap-4 text-sm">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Real Feel</span>
          <span className="font-medium text-gray-800">{Math.round(current.apparent_temperature)}°</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Wind</span>
          <span className="font-medium text-gray-800">{current.wind_speed_10m} km/h</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-500">Humidity</span>
          <span className="font-medium text-gray-800">{current.relative_humidity_2m}%</span>
        </div>
        
        {/* Additional details if available */}
        {current.visibility && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Visibility</span>
            <span className="font-medium text-gray-800">{(current.visibility / 1000).toFixed(1)} km</span>
          </div>
        )}
        
        {current.surface_pressure && (
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Pressure</span>
            <span className="font-medium text-gray-800">{Math.round(current.surface_pressure)} hPa</span>
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Last updated: {new Date(current.time).toLocaleString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short'
          })}
        </p>
      </div>
    </div>
  );
}

export default MainDisplay;