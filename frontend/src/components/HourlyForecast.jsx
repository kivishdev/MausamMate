// File: frontend/src/components/HourlyForecast.jsx
// Purpose: Enhanced hourly forecast with detailed weather insights and smart features

import { useState, useRef, useEffect } from 'react';
import { useWeatherStore } from '../state/weatherStore';
import { getWeatherIcon } from '../utils/weatherUtils.jsx';
import { 
  Droplets, 
  Wind, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Umbrella,
  Thermometer,
  Zap
} from 'lucide-react';

function HourlyForecast() {
  const { weatherData } = useWeatherStore();
  const [selectedHour, setSelectedHour] = useState(null);
  const scrollRef = useRef(null);

  // Auto-scroll to current hour on mount - MUST be before early return
  useEffect(() => {
    if (weatherData && scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [weatherData]);

  if (!weatherData) return null;

  const { hourly } = weatherData;
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(time => new Date(time) > now);
  const hours = hourly.time.slice(currentHourIndex, currentHourIndex + 48); // Show 48 hours

  // Helper functions
  const isCurrentHour = (time) => {
    const hourTime = new Date(time);
    const currentTime = new Date();
    return Math.abs(hourTime.getTime() - currentTime.getTime()) < 30 * 60 * 1000; // Within 30 minutes
  };

  const getTimeLabel = (time, index) => {
    const date = new Date(time);
    const hour = date.getHours();
    
    if (isCurrentHour(time)) return 'Now';
    if (index === 0) return 'Now';
    
    // Show special time markers
    if (hour === 0) return '12 AM';
    if (hour === 6) return '6 AM';
    if (hour === 12) return '12 PM';
    if (hour === 18) return '6 PM';
    
    return date.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true });
  };

  const getDayLabel = (time, prevTime) => {
    const date = new Date(time);
    const prevDate = prevTime ? new Date(prevTime) : null;
    
    if (!prevDate || date.getDate() !== prevDate.getDate()) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
      return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    return null;
  };

  const getTemperatureTrend = (currentTemp, nextTemp) => {
    if (nextTemp === undefined) return null;
    const diff = nextTemp - currentTemp;
    if (Math.abs(diff) < 0.5) return { icon: Minus, color: 'text-gray-400' };
    return diff > 0 
      ? { icon: TrendingUp, color: 'text-red-400' }
      : { icon: TrendingDown, color: 'text-blue-400' };
  };

  const getPrecipitationInfo = (index) => {
    const actualIndex = currentHourIndex + index;
    const precipitation = hourly.precipitation?.[actualIndex] || 0;
    const probability = hourly.precipitation_probability?.[actualIndex] || 0;
    
    if (precipitation > 0) {
      return { value: `${precipitation.toFixed(1)}mm`, type: 'amount', color: 'text-blue-600' };
    }
    if (probability > 20) {
      return { value: `${probability}%`, type: 'chance', color: 'text-blue-500' };
    }
    return null;
  };

  const getHourlyDetails = (index) => {
    const actualIndex = currentHourIndex + index;
    return {
      temperature: hourly.temperature_2m?.[actualIndex],
      humidity: hourly.relative_humidity_2m?.[actualIndex],
      windSpeed: hourly.wind_speed_10m?.[actualIndex],
      windDirection: hourly.wind_direction_10m?.[actualIndex],
      precipitation: hourly.precipitation?.[actualIndex] || 0,
      precipitationProb: hourly.precipitation_probability?.[actualIndex] || 0,
      pressure: hourly.surface_pressure?.[actualIndex],
      visibility: hourly.visibility?.[actualIndex],
      apparentTemp: hourly.apparent_temperature?.[actualIndex],
      dewPoint: hourly.dew_point_2m?.[actualIndex],
      cloudCover: hourly.cloud_cover?.[actualIndex]
    };
  };

  // Scroll functions
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const isNightTime = (time) => {
    const hour = new Date(time).getHours();
    return hour < 6 || hour > 18;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Hourly Forecast</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">48 hours</span>
          <button 
            onClick={scrollLeft}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-400" />
          </button>
          <button 
            onClick={scrollRight}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Hourly Cards */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-3 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hours.map((time, index) => {
          const actualIndex = currentHourIndex + index;
          const { icon, severity } = getWeatherIcon(hourly.weather_code[actualIndex]);
          const isCurrent = isCurrentHour(time);
          const isNight = isNightTime(time);
          const dayLabel = getDayLabel(time, index > 0 ? hours[index - 1] : null);
          const details = getHourlyDetails(index);
          const precipInfo = getPrecipitationInfo(index);
          const tempTrend = getTemperatureTrend(
            details.temperature, 
            hourly.temperature_2m?.[actualIndex + 1]
          );
          const isSelected = selectedHour === index;

          return (
            <div key={time} className="flex-shrink-0">
              {/* Day Label */}
              {dayLabel && (
                <div className="text-xs font-medium text-gray-600 mb-2 text-center px-2 py-1 bg-gray-100 rounded-full">
                  {dayLabel}
                </div>
              )}
              
              {/* Hour Card */}
              <div 
                className={`
                  flex flex-col items-center p-4 rounded-xl min-w-[85px] cursor-pointer
                  transition-all duration-300 hover:shadow-md hover:-translate-y-1
                  ${isCurrent 
                    ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg' 
                    : isSelected
                      ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-300'
                      : severity === 'high'
                        ? 'bg-gradient-to-b from-orange-50 to-red-50 border border-orange-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }
                  ${isNight && !isCurrent ? 'bg-gradient-to-b from-indigo-50 to-purple-50' : ''}
                `}
                onClick={() => setSelectedHour(isSelected ? null : index)}
              >
                {/* Time */}
                <div className="flex items-center gap-1 mb-2">
                  {isCurrent && <Clock size={12} />}
                  {isNight && !isCurrent && <Moon size={12} className="text-indigo-400" />}
                  {!isNight && !isCurrent && <Sun size={12} className="text-yellow-500" />}
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-white' : 'text-gray-600'
                  }`}>
                    {getTimeLabel(time, index)}
                  </p>
                </div>

                {/* Weather Icon */}
                <div className="mb-3 scale-90 transition-transform group-hover:scale-100">
                  {icon}
                </div>

                {/* Temperature with Trend */}
                <div className="flex items-center gap-1 mb-2">
                  <p className={`font-bold text-lg ${
                    isCurrent ? 'text-white' : 'text-gray-800'
                  }`}>
                    {Math.round(details.temperature)}°
                  </p>
                  {tempTrend && (
                    <tempTrend.icon size={12} className={tempTrend.color} />
                  )}
                </div>

                {/* Feels Like Temperature */}
                {details.apparentTemp && Math.abs(details.apparentTemp - details.temperature) > 2 && (
                  <p className={`text-xs ${isCurrent ? 'text-blue-100' : 'text-gray-500'} mb-1`}>
                    Feels {Math.round(details.apparentTemp)}°
                  </p>
                )}

                {/* Precipitation Info */}
                {precipInfo && (
                  <div className={`flex items-center gap-1 text-xs ${
                    isCurrent ? 'text-blue-100' : precipInfo.color
                  }`}>
                    {precipInfo.type === 'amount' ? (
                      <Droplets size={10} />
                    ) : (
                      <Umbrella size={10} />
                    )}
                    <span>{precipInfo.value}</span>
                  </div>
                )}

                {/* Wind Speed (if significant) */}
                {details.windSpeed > 10 && (
                  <div className={`flex items-center gap-1 text-xs mt-1 ${
                    isCurrent ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <Wind size={10} />
                    <span>{Math.round(details.windSpeed)} km/h</span>
                  </div>
                )}

                {/* Severity Alert */}
                {severity === 'high' && (
                  <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                    <Zap size={10} />
                    <span>Alert</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed View for Selected Hour */}
      {selectedHour !== null && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">
              Detailed View - {getTimeLabel(hours[selectedHour], selectedHour)}
            </h4>
            <button 
              onClick={() => setSelectedHour(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(() => {
              const details = getHourlyDetails(selectedHour);
              return (
                <>
                  {/* Temperature Details */}
                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer size={14} className="text-red-500" />
                      <span className="text-xs font-medium text-gray-600">TEMPERATURE</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {Math.round(details.temperature)}°
                    </p>
                    <p className="text-xs text-gray-500">
                      Feels like {Math.round(details.apparentTemp)}°
                    </p>
                  </div>

                  {/* Humidity */}
                  {details.humidity && (
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplets size={14} className="text-blue-500" />
                        <span className="text-xs font-medium text-gray-600">HUMIDITY</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {details.humidity}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {details.humidity > 70 ? 'High' : details.humidity > 40 ? 'Comfortable' : 'Low'}
                      </p>
                    </div>
                  )}

                  {/* Wind */}
                  {details.windSpeed && (
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Wind size={14} className="text-green-500" />
                        <span className="text-xs font-medium text-gray-600">WIND</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {Math.round(details.windSpeed)} km/h
                      </p>
                      <p className="text-xs text-gray-500">
                        {details.windSpeed > 25 ? 'Strong' : details.windSpeed > 15 ? 'Moderate' : 'Light'}
                      </p>
                    </div>
                  )}

                  {/* Precipitation */}
                  {(details.precipitation > 0 || details.precipitationProb > 20) && (
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Umbrella size={14} className="text-blue-600" />
                        <span className="text-xs font-medium text-gray-600">RAIN</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {details.precipitation > 0 
                          ? `${details.precipitation.toFixed(1)}mm`
                          : `${details.precipitationProb}%`
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {details.precipitation > 0 ? 'Expected' : 'Probability'}
                      </p>
                    </div>
                  )}

                  {/* Visibility */}
                  {details.visibility && (
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye size={14} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">VISIBILITY</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {(details.visibility / 1000).toFixed(1)} km
                      </p>
                      <p className="text-xs text-gray-500">
                        {details.visibility >= 10000 ? 'Excellent' : 
                         details.visibility >= 5000 ? 'Good' : 
                         details.visibility >= 2000 ? 'Moderate' : 'Poor'}
                      </p>
                    </div>
                  )}

                  {/* Cloud Cover */}
                  {details.cloudCover !== undefined && (
                    <div className="bg-white p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Sun size={14} className="text-yellow-500" />
                        <span className="text-xs font-medium text-gray-600">CLOUDS</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {details.cloudCover}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {details.cloudCover < 25 ? 'Clear' : 
                         details.cloudCover < 50 ? 'Partly cloudy' : 
                         details.cloudCover < 75 ? 'Mostly cloudy' : 'Overcast'}
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Quick Stats Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Next 24h:</span>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-red-500" />
              <span className="font-medium text-gray-800">
                {Math.max(...hours.slice(0, 24).map((_, i) => 
                  Math.round(hourly.temperature_2m[currentHourIndex + i])
                ))}°
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown size={14} className="text-blue-500" />
              <span className="font-medium text-gray-800">
                {Math.min(...hours.slice(0, 24).map((_, i) => 
                  Math.round(hourly.temperature_2m[currentHourIndex + i])
                ))}°
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Click any hour for details
          </div>
        </div>
      </div>
    </div>
  );
}

export default HourlyForecast;