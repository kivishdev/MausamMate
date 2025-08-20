// File: frontend/src/components/InfoGrid.jsx
// Purpose: Displays a smarter grid that adapts to the current weather.

import InfoCard from './InfoCard';
import { Thermometer, Droplets, Wind, Eye, Gauge, Umbrella, Sun, Sunrise, Sunset } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function InfoGrid() {
  const { weatherData } = useWeatherStore();

  if (!weatherData) return null;

  const { current, daily, air_quality } = weatherData;

  // --- THE NEW SMART LOGIC ---
  // We check if the current weather code indicates it's rainy, foggy, or overcast.
  // WMO codes 45 and above are generally for these conditions.
  const isOvercast = current.weather_code >= 45;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      
      {/* Air Pollution Card (No changes here) */}
      <div className="col-span-2 md:col-span-3">
        <InfoCard icon={<Wind size={18} />} title="Air Pollution">
          <p className="text-xl font-bold text-gray-800">Good air quality</p>
          <div className="w-full bg-gray-200 rounded-full h-2 my-2">
            <div 
              className="bg-gradient-to-r from-green-400 via-yellow-500 to-red-500 h-2 rounded-full" 
              style={{ width: `${Math.min((air_quality.hourly.us_aqi[0] / 200) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">AQI: {air_quality.hourly.us_aqi[0]}</p>
        </InfoCard>
      </div>

      {/* UV Index Card with the new logic */}
      <InfoCard 
        icon={<Sun size={18} />} 
        title="UV INDEX" 
        value={isOvercast ? "Low" : daily.uv_index_max[0].toFixed(1)} 
        description={isOvercast ? "Low due to clouds/rain" : "Higher values require sun protection."}
      />
      
      <InfoCard icon={<Sunrise size={18} />} title="SUNRISE" value={new Date(daily.sunrise[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} />
      <InfoCard icon={<Sunset size={18} />} title="SUNSET" value={new Date(daily.sunset[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} />
      <InfoCard icon={<Umbrella size={18} />} title="CHANCE OF RAIN" value={`${daily.precipitation_probability_max[0]}%`} description="Max probability for today" />
      <InfoCard icon={<Thermometer size={18} />} title="FEELS LIKE" value={`${Math.round(current.apparent_temperature)}°`} />
      
      {/* Wind Card with more details */}
      <InfoCard icon={<Wind size={18} />} title="WIND">
        <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-800">{current.wind_speed_10m}</span>
            <span className="text-sm font-medium text-gray-500 -mb-1">km/h</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Gusts: {current.wind_gusts_10m} km/h</p>
      </InfoCard>
    </div>
  );
}

export default InfoGrid;
