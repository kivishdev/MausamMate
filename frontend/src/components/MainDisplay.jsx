// ========================================================================
// File: frontend/src/components/MainDisplay.jsx (UPDATED VERSION)
// Purpose: Main weather display with modern card design
// ========================================================================
import { ChevronDown } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';
import { getWeatherIcon } from '../utils/weatherUtils.jsx';

function MainDisplay() {
  const { weatherData, location } = useWeatherStore();

  if (!weatherData || !location) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-8 rounded-2xl bg-white shadow-sm">
        Loading...
      </div>
    );
  }

  const { current } = weatherData;
  const { icon, description } = getWeatherIcon(current.weather_code);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      {/* Header with Date and Time */}
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
        <div className="flex items-center gap-1 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
          <span className="font-medium text-sm">{location.name}</span>
          <ChevronDown size={16} />
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

      {/* Weather Description */}
      <div className="mb-8">
        <p className="text-gray-600 capitalize text-lg">{description}</p>
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
      </div>
    </div>
  );
}
export default MainDisplay;

