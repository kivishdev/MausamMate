// File: frontend/src/components/InfoGrid.jsx
// Purpose: Enhanced smart grid with corrected weather alert and precipitation logic

import InfoCard from './InfoCard';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Umbrella, 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon,
  AlertTriangle,
  CloudRain,
  Snowflake
} from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';
import { getWindDirection } from '../utils/weatherUtils.jsx';

function InfoGrid() {
  const { weatherData } = useWeatherStore();

  if (!weatherData) return null;

  const { current, daily, air_quality } = weatherData;

  // Enhanced weather condition detection
  const getWeatherCondition = (code) => {
    if (code === 0) return { type: 'clear', severity: 'low' };
    if (code <= 3) return { type: 'partly_cloudy', severity: 'low' };
    if (code <= 48) return { type: 'foggy', severity: 'medium' };
    if (code <= 67) return { type: 'rainy', severity: 'low' };
    if (code <= 77) return { type: 'snowy', severity: 'low' };
    if (code <= 82) return { type: 'heavy_rain', severity: 'medium' };
    if (code <= 86) return { type: 'heavy_snow', severity: 'medium' };
    return { type: 'stormy', severity: 'high' };
  };

  const condition = getWeatherCondition(current.weather_code);
  const isNight = current.is_day === 0;

  // Enhanced UV Index logic
  const getUVInfo = () => {
    const uvIndex = daily.uv_index_max?.[0];
    if (!uvIndex && uvIndex !== 0) {
      return { level: 'Unknown', value: 'N/A', description: 'UV data unavailable', color: 'text-gray-500' };
    }

    // Adjust for weather conditions
    if (condition.type === 'rainy' || condition.type === 'heavy_rain' || condition.type === 'foggy') {
      const adjustedUV = Math.max(0, uvIndex * 0.3); // Reduce UV by ~70% for cloudy/rainy conditions
      return { level: 'Low', value: adjustedUV.toFixed(1), description: 'Reduced due to clouds', color: 'text-green-600' };
    }
    
    if (isNight) {
      return { level: 'None', value: '0', description: 'No UV exposure at night', color: 'text-gray-600' };
    }

    if (uvIndex <= 2) return { level: 'Low', value: uvIndex.toFixed(1), description: 'Minimal protection needed', color: 'text-green-600' };
    if (uvIndex <= 5) return { level: 'Moderate', value: uvIndex.toFixed(1), description: 'Some protection recommended', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: 'High', value: uvIndex.toFixed(1), description: 'Protection required', color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: 'Very High', value: uvIndex.toFixed(1), description: 'Extra protection required', color: 'text-red-600' };
    return { level: 'Extreme', value: uvIndex.toFixed(1), description: 'Avoid midday sun', color: 'text-purple-600' };
  };

  // Enhanced AQI with health recommendations
  const getAQIInfo = () => {
    const aqi = air_quality?.hourly?.us_aqi?.[0];
    if (!aqi && aqi !== 0) {
      return { level: 'Unknown', description: 'Air quality data unavailable', color: 'from-gray-300 to-gray-400', severity: 'low' };
    }

    if (aqi <= 50) return { level: 'Good', description: 'Air quality is satisfactory', color: 'from-green-400 to-green-500', severity: 'low' };
    if (aqi <= 100) return { level: 'Moderate', description: 'Acceptable for most people', color: 'from-yellow-400 to-yellow-500', severity: 'low' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', description: 'Sensitive groups may experience symptoms', color: 'from-orange-400 to-orange-500', severity: 'medium' };
    if (aqi <= 200) return { level: 'Unhealthy', description: 'Everyone may experience symptoms', color: 'from-red-400 to-red-500', severity: 'high' };
    return { level: 'Very Unhealthy', description: 'Health warning for everyone', color: 'from-purple-400 to-purple-500', severity: 'high' };
  };

  // Enhanced visibility description
  const getVisibilityInfo = () => {
    const visibility = current.visibility;
    if (!visibility && visibility !== 0) return null;
    
    const visibilityKm = visibility / 1000;
    let description, severity;
    
    if (visibilityKm >= 10) {
      description = 'Excellent';
      severity = 'low';
    } else if (visibilityKm >= 5) {
      description = 'Good';
      severity = 'low';
    } else if (visibilityKm >= 2) {
      description = 'Moderate';
      severity = 'medium';
    } else if (visibilityKm >= 1) {
      description = 'Poor';
      severity = 'high';
    } else {
      description = 'Very Poor';
      severity = 'high';
    }

    return {
      value: `${visibilityKm.toFixed(1)} km`,
      description,
      severity
    };
  };

  // Enhanced pressure info
  const getPressureInfo = () => {
    const pressure = current.surface_pressure || current.pressure_msl;
    if (!pressure) return null;

    let description, trend;
    if (pressure > 1020) {
      description = 'High pressure';
      trend = { direction: 'stable', value: 'Settled weather' };
    } else if (pressure < 1000) {
      description = 'Low pressure';
      trend = { direction: 'down', value: 'Unsettled weather' };
    } else {
      description = 'Normal pressure';
      trend = { direction: 'stable', value: 'Stable conditions' };
    }

    return {
      value: `${Math.round(pressure)} hPa`,
      description,
      trend
    };
  };

  const uvInfo = getUVInfo();
  const aqiInfo = getAQIInfo();
  const visibilityInfo = getVisibilityInfo();
  const pressureInfo = getPressureInfo();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      
      {/* Enhanced Air Quality Card */}
      <div className="col-span-2 md:col-span-3">
        <InfoCard 
          icon={<Wind size={18} />} 
          title="Air Quality"
          severity={aqiInfo.severity}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold text-gray-800">{aqiInfo.level}</p>
            {air_quality?.hourly?.us_aqi?.[0] && (
              <span className="text-sm font-medium text-gray-600">
                AQI {air_quality.hourly.us_aqi[0]}
              </span>
            )}
          </div>
          {air_quality?.hourly?.us_aqi?.[0] && (
            <div className="w-full bg-gray-200 rounded-full h-3 my-2">
              <div 
                className={`bg-gradient-to-r ${aqiInfo.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((air_quality.hourly.us_aqi[0] / 200) * 100, 100)}%` }}
              ></div>
            </div>
          )}
          <p className="text-xs text-gray-500">{aqiInfo.description}</p>
        </InfoCard>
      </div>

      {/* Enhanced UV Index Card */}
      <InfoCard 
        icon={isNight ? <Moon size={18} /> : <Sun size={18} />} 
        title="UV INDEX"
        value={uvInfo.value}
        description={uvInfo.description}
        severity={uvInfo.level === 'High' || uvInfo.level === 'Very High' ? 'medium' : uvInfo.level === 'Extreme' ? 'high' : 'low'}
      >
        <span className={`text-sm font-medium ${uvInfo.color}`}>{uvInfo.level}</span>
      </InfoCard>

      {/* Enhanced Temperature Card */}
      <InfoCard 
        icon={<Thermometer size={18} />} 
        title="FEELS LIKE"
        value={current.apparent_temperature ? `${Math.round(current.apparent_temperature)}°` : 'N/A'}
        severity={
          current.apparent_temperature > 35 ? 'high' :
          current.apparent_temperature < 5 ? 'high' :
          'low'
        }
      >
        {current.temperature_2m && (
          <p className="text-xs text-gray-500 mt-1">
            Actual: {Math.round(current.temperature_2m)}°
          </p>
        )}
      </InfoCard>

      {/* Enhanced Wind Card */}
      <InfoCard 
        icon={<Wind size={18} />} 
        title="WIND"
        severity={
          current.wind_speed_10m > 60 ? 'high' :
          current.wind_speed_10m > 35 ? 'medium' :
          'low'
        }
      >
        <div className="space-y-1">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-800">
              {current.wind_speed_10m || 0}
            </span>
            <span className="text-sm font-medium text-gray-500 -mb-1">km/h</span>
            {current.wind_direction_10m && (
              <span className="text-sm text-gray-400 -mb-1">
                {getWindDirection(current.wind_direction_10m)}
              </span>
            )}
          </div>
          {current.wind_gusts_10m && (
            <p className="text-xs text-gray-500">
              Gusts: {current.wind_gusts_10m} km/h
            </p>
          )}
        </div>
      </InfoCard>

      {/* Rain Chance Card - Only show probability */}
      {daily.precipitation_probability_max?.[0] && daily.precipitation_probability_max[0] > 20 && (
        <InfoCard 
          icon={<Umbrella size={18} />} 
          title="RAIN CHANCE"
          value={`${daily.precipitation_probability_max[0]}%`}
          severity={
            (daily.precipitation_probability_max?.[0] || 0) > 80 ? 'high' :
            (daily.precipitation_probability_max?.[0] || 0) > 60 ? 'medium' :
            'low'
          }
        >
          <p className="text-xs text-gray-500 mt-1">
            Probability for today
          </p>
        </InfoCard>
      )}

      {/* Enhanced Humidity Card */}
      <InfoCard 
        icon={<Droplets size={18} />} 
        title="HUMIDITY"
        value={current.relative_humidity_2m ? `${current.relative_humidity_2m}%` : 'N/A'}
        severity={
          current.relative_humidity_2m > 80 ? 'medium' :
          current.relative_humidity_2m < 30 ? 'medium' :
          'low'
        }
      >
        {current.relative_humidity_2m && (
          <p className="text-xs text-gray-500 mt-1">
            {current.relative_humidity_2m > 70 ? 'High humidity' :
             current.relative_humidity_2m > 40 ? 'Comfortable' : 
             'Low humidity'}
          </p>
        )}
      </InfoCard>

      {/* Enhanced Sunrise/Sunset Card */}
      <InfoCard 
        icon={isNight ? <Moon size={18} /> : <Sun size={18} />} 
        title={isNight ? "NEXT SUNRISE" : "SUNSET TODAY"}
      >
        <div className="space-y-1">
          {daily.sunrise?.[0] && (
            <div className="flex items-center gap-2">
              <Sunrise size={14} className="text-orange-400" />
              <span className="text-sm font-medium">
                {new Date(daily.sunrise[0]).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
          {daily.sunset?.[0] && (
            <div className="flex items-center gap-2">
              <Sunset size={14} className="text-orange-600" />
              <span className="text-sm font-medium">
                {new Date(daily.sunset[0]).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          )}
        </div>
      </InfoCard>

      {/* Visibility Card (if available) */}
      {visibilityInfo && (
        <InfoCard 
          icon={<Eye size={18} />} 
          title="VISIBILITY"
          value={visibilityInfo.value}
          description={visibilityInfo.description}
          severity={visibilityInfo.severity}
        />
      )}

      {/* Pressure Card (if available) */}
      {pressureInfo && (
        <InfoCard 
          icon={<Gauge size={18} />} 
          title="PRESSURE"
          value={pressureInfo.value}
          description={pressureInfo.description}
          trend={pressureInfo.trend}
        />
      )}


      
    </div>
  );
}

export default InfoGrid;