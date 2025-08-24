// File: frontend/src/components/DailyForecast.jsx
// Purpose: Enhanced daily forecast with detailed weather insights and better UX

import { useState } from 'react';
import { useWeatherStore } from '../state/weatherStore';
import { getWeatherIcon, getWeatherAdvice, getWeatherEmoji } from '../utils/weatherUtils.jsx';
import { 
  ChevronDown, 
  ChevronUp, 
  Droplets, 
  Wind, 
  Sun, 
  Umbrella,
  Thermometer,
  Eye,
  Sunrise,
  Sunset,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

function DailyForecast() {
  const { weatherData } = useWeatherStore();
  const [expandedDay, setExpandedDay] = useState(null);

  if (!weatherData) return null;

  const { daily } = weatherData;

  // Helper function to get temperature trend
  const getTemperatureTrend = (currentMax, nextMax) => {
    if (!nextMax) return null;
    const diff = nextMax - currentMax;
    if (Math.abs(diff) < 1) return { icon: Minus, text: "stable", color: "text-gray-500" };
    if (diff > 0) return { icon: TrendingUp, text: `+${diff.toFixed(1)}°`, color: "text-red-500" };
    return { icon: TrendingDown, text: `${diff.toFixed(1)}°`, color: "text-blue-500" };
  };

  // Helper to get day label
  const getDayLabel = (time, index) => {
    const date = new Date(time);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    
    return date.toLocaleDateString('en-IN', { weekday: 'long' });
  };

  // Get detailed info for expanded view
  const getDetailedInfo = (index) => {
    return {
      humidity: daily.relative_humidity_2m?.[index],
      windSpeed: daily.wind_speed_10m_max?.[index],
      windDirection: daily.wind_direction_10m_dominant?.[index],
      precipitation: daily.precipitation_sum?.[index] || 0,
      precipitationHours: daily.precipitation_hours?.[index] || 0,
      uvIndex: daily.uv_index_max?.[index],
      sunrise: daily.sunrise?.[index],
      sunset: daily.sunset?.[index],
      visibility: daily.visibility?.[index]
    };
  };

  // Get precipitation probability color
  const getPrecipitationColor = (probability) => {
    if (probability >= 70) return "text-blue-600 bg-blue-100";
    if (probability >= 40) return "text-orange-600 bg-orange-100";
    if (probability >= 20) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-800">10-Day Forecast</h3>
        <div className="text-xs text-gray-500">
          Tap any day for details
        </div>
      </div>
      
      <div className="space-y-2">
        {daily.time.slice(0, 10).map((time, index) => {
          const { icon, description, severity } = getWeatherIcon(daily.weather_code[index]);
          const isExpanded = expandedDay === index;
          const detailInfo = getDetailedInfo(index);
          const tempTrend = getTemperatureTrend(
            daily.temperature_2m_max[index], 
            daily.temperature_2m_max[index + 1]
          );

          return (
            <div key={time} className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Main Row - Always Visible */}
              <div 
                className={`flex justify-between items-center p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  isExpanded ? 'bg-blue-50 border-blue-200' : ''
                } ${severity === 'high' ? 'border-l-4 border-l-orange-400' : ''}`}
                onClick={() => setExpandedDay(isExpanded ? null : index)}
              >
                {/* Day and Date */}
                <div className="flex flex-col min-w-[100px]">
                  <p className="font-medium text-gray-800 text-sm">
                    {getDayLabel(time, index)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(time).toLocaleDateString('en-IN', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Weather Icon and Description */}
                <div className="flex items-center gap-3 flex-1 justify-center">
                  <div className="scale-90">{icon}</div>
                  <div className="hidden sm:flex flex-col items-center">
                    <span className="text-sm text-gray-600 text-center min-w-[120px]">
                      {description}
                    </span>
                    {daily.precipitation_probability_max?.[index] > 0 && (
                      <div className={`text-xs px-2 py-1 rounded-full mt-1 ${getPrecipitationColor(daily.precipitation_probability_max[index])}`}>
                        {daily.precipitation_probability_max[index]}% rain
                      </div>
                    )}
                  </div>
                </div>

                {/* Temperature Range */}
                <div className="flex items-center gap-3 min-w-[80px] justify-end">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-800 text-lg">
                        {Math.round(daily.temperature_2m_max[index])}°
                      </span>
                      <span className="text-gray-500">
                        {Math.round(daily.temperature_2m_min[index])}°
                      </span>
                    </div>
                    {tempTrend && (
                      <div className={`flex items-center gap-1 text-xs ${tempTrend.color}`}>
                        <tempTrend.icon size={12} />
                        <span>{tempTrend.text}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-2">
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-blue-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
                  {/* Weather Advice */}
                  <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      {getWeatherEmoji(daily.weather_code[index])} Weather Advice
                    </p>
                    <p className="text-xs text-blue-700">
                      {getWeatherAdvice(daily.weather_code[index])}
                    </p>
                  </div>

                  {/* Detailed Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Precipitation */}
                    {(detailInfo.precipitation > 0 || daily.precipitation_probability_max?.[index] > 0) && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Umbrella size={16} className="text-blue-500" />
                          <span className="text-xs font-medium text-gray-600">RAIN</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {detailInfo.precipitation.toFixed(1)}mm
                        </p>
                        <p className="text-xs text-gray-500">
                          {detailInfo.precipitationHours}h duration
                        </p>
                      </div>
                    )}

                    {/* Wind */}
                    {detailInfo.windSpeed && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Wind size={16} className="text-green-500" />
                          <span className="text-xs font-medium text-gray-600">WIND</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {detailInfo.windSpeed.toFixed(1)} km/h
                        </p>
                        <p className="text-xs text-gray-500">
                          Max speed
                        </p>
                      </div>
                    )}

                    {/* UV Index */}
                    {detailInfo.uvIndex !== undefined && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Sun size={16} className="text-yellow-500" />
                          <span className="text-xs font-medium text-gray-600">UV INDEX</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {detailInfo.uvIndex.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {detailInfo.uvIndex <= 2 ? 'Low' :
                           detailInfo.uvIndex <= 5 ? 'Moderate' :
                           detailInfo.uvIndex <= 7 ? 'High' : 'Very High'}
                        </p>
                      </div>
                    )}

                    {/* Humidity */}
                    {detailInfo.humidity && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Droplets size={16} className="text-blue-400" />
                          <span className="text-xs font-medium text-gray-600">HUMIDITY</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {detailInfo.humidity}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {detailInfo.humidity > 70 ? 'High' :
                           detailInfo.humidity > 40 ? 'Comfortable' : 'Low'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sunrise/Sunset */}
                  {(detailInfo.sunrise && detailInfo.sunset) && (
                    <div className="mt-3 bg-white p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Sunrise size={16} className="text-orange-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">SUNRISE</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {new Date(detailInfo.sunrise).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sunset size={16} className="text-orange-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">SUNSET</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {new Date(detailInfo.sunset).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-gray-800 mb-2">Week Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-600 mb-1">Avg High</p>
            <p className="font-semibold text-gray-800">
              {Math.round(daily.temperature_2m_max.slice(0, 7).reduce((a, b) => a + b) / 7)}°
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Avg Low</p>
            <p className="font-semibold text-gray-800">
              {Math.round(daily.temperature_2m_min.slice(0, 7).reduce((a, b) => a + b) / 7)}°
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Rainy Days</p>
            <p className="font-semibold text-gray-800">
              {daily.precipitation_probability_max?.slice(0, 7).filter(p => p > 50).length || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Max UV</p>
            <p className="font-semibold text-gray-800">
              {Math.max(...(daily.uv_index_max?.slice(0, 7) || [0])).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyForecast;