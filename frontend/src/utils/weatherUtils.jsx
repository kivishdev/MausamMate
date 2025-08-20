// File: frontend/src/utils/weatherUtils.js
// Purpose: Enhanced weather utility functions with comprehensive WMO code support

import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudSnow, 
  CloudLightning, 
  Haze, 
  CloudFog,
  Wind,
  Eye,
  Snowflake,
  Zap
} from 'lucide-react';

// Enhanced weather code mapping with more comprehensive coverage
const weatherCodeMap = {
  // Clear sky
  0: {
    icon: Sun,
    description: "Clear sky",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    category: "clear",
    severity: "low"
  },
  
  // Mainly clear, partly cloudy, overcast
  1: {
    icon: Sun,
    description: "Mainly clear",
    color: "text-yellow-400",
    bgColor: "bg-yellow-50",
    category: "clear",
    severity: "low"
  },
  2: {
    icon: Cloud,
    description: "Partly cloudy",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    category: "cloudy",
    severity: "low"
  },
  3: {
    icon: Cloud,
    description: "Overcast",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    category: "cloudy",
    severity: "medium"
  },
  
  // Fog and depositing rime fog
  45: {
    icon: CloudFog,
    description: "Fog",
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    category: "fog",
    severity: "medium"
  },
  48: {
    icon: CloudFog,
    description: "Depositing rime fog",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    category: "fog",
    severity: "medium"
  },
  
  // Drizzle: Light, moderate, and dense intensity
  51: {
    icon: CloudDrizzle,
    description: "Light drizzle",
    color: "text-blue-300",
    bgColor: "bg-blue-50",
    category: "drizzle",
    severity: "low"
  },
  53: {
    icon: CloudDrizzle,
    description: "Moderate drizzle",
    color: "text-blue-400",
    bgColor: "bg-blue-50",
    category: "drizzle",
    severity: "medium"
  },
  55: {
    icon: CloudDrizzle,
    description: "Dense drizzle",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    category: "drizzle",
    severity: "medium"
  },
  
  // Freezing drizzle
  56: {
    icon: CloudDrizzle,
    description: "Light freezing drizzle",
    color: "text-cyan-400",
    bgColor: "bg-cyan-50",
    category: "freezing",
    severity: "medium"
  },
  57: {
    icon: CloudDrizzle,
    description: "Dense freezing drizzle",
    color: "text-cyan-500",
    bgColor: "bg-cyan-100",
    category: "freezing",
    severity: "high"
  },
  
  // Rain: Slight, moderate, and heavy intensity
  61: {
    icon: CloudRain,
    description: "Slight rain",
    color: "text-blue-400",
    bgColor: "bg-blue-50",
    category: "rain",
    severity: "low"
  },
  63: {
    icon: CloudRain,
    description: "Moderate rain",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    category: "rain",
    severity: "medium"
  },
  65: {
    icon: CloudRain,
    description: "Heavy rain",
    color: "text-blue-600",
    bgColor: "bg-blue-200",
    category: "rain",
    severity: "high"
  },
  
  // Freezing rain
  66: {
    icon: CloudRain,
    description: "Light freezing rain",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    category: "freezing",
    severity: "high"
  },
  67: {
    icon: CloudRain,
    description: "Heavy freezing rain",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    category: "freezing",
    severity: "high"
  },
  
  // Snow fall
  71: {
    icon: CloudSnow,
    description: "Slight snow",
    color: "text-blue-300",
    bgColor: "bg-blue-50",
    category: "snow",
    severity: "medium"
  },
  73: {
    icon: CloudSnow,
    description: "Moderate snow",
    color: "text-blue-400",
    bgColor: "bg-blue-100",
    category: "snow",
    severity: "high"
  },
  75: {
    icon: CloudSnow,
    description: "Heavy snow",
    color: "text-blue-500",
    bgColor: "bg-blue-200",
    category: "snow",
    severity: "high"
  },
  
  // Snow grains
  77: {
    icon: Snowflake,
    description: "Snow grains",
    color: "text-blue-400",
    bgColor: "bg-blue-50",
    category: "snow",
    severity: "medium"
  },
  
  // Rain showers
  80: {
    icon: CloudRain,
    description: "Slight rain showers",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    category: "showers",
    severity: "medium"
  },
  81: {
    icon: CloudRain,
    description: "Moderate rain showers",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    category: "showers",
    severity: "medium"
  },
  82: {
    icon: CloudRain,
    description: "Violent rain showers",
    color: "text-blue-700",
    bgColor: "bg-blue-200",
    category: "showers",
    severity: "high"
  },
  
  // Snow showers
  85: {
    icon: CloudSnow,
    description: "Slight snow showers",
    color: "text-blue-400",
    bgColor: "bg-blue-50",
    category: "snow",
    severity: "medium"
  },
  86: {
    icon: CloudSnow,
    description: "Heavy snow showers",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    category: "snow",
    severity: "high"
  },
  
  // Thunderstorms
  95: {
    icon: CloudLightning,
    description: "Thunderstorm",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    category: "storm",
    severity: "high"
  },
  96: {
    icon: CloudLightning,
    description: "Thunderstorm with slight hail",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    category: "storm",
    severity: "high"
  },
  99: {
    icon: CloudLightning,
    description: "Thunderstorm with heavy hail",
    color: "text-yellow-700",
    bgColor: "bg-yellow-200",
    category: "storm",
    severity: "high"
  }
};

// Main function to get weather icon and details
export const getWeatherIcon = (code, size = 64, customClassName = "") => {
  const weatherData = weatherCodeMap[code] || {
    icon: Haze,
    description: "Unknown weather",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    category: "unknown",
    severity: "low"
  };

  const IconComponent = weatherData.icon;
  const className = customClassName || `${weatherData.color}`;

  return {
    icon: <IconComponent size={size} className={className} />,
    description: weatherData.description,
    color: weatherData.color,
    bgColor: weatherData.bgColor,
    category: weatherData.category,
    severity: weatherData.severity
  };
};

// Get weather category for styling
export const getWeatherCategory = (code) => {
  const weatherData = weatherCodeMap[code];
  return weatherData?.category || 'unknown';
};

// Get weather severity level
export const getWeatherSeverity = (code) => {
  const weatherData = weatherCodeMap[code];
  return weatherData?.severity || 'low';
};

// Get appropriate background color for weather cards
export const getWeatherBgColor = (code) => {
  const weatherData = weatherCodeMap[code];
  return weatherData?.bgColor || 'bg-gray-50';
};

// Check if weather is severe
export const isSevereWeather = (code) => {
  const severity = getWeatherSeverity(code);
  return severity === 'high';
};

// Get weather emoji for fun displays
export const getWeatherEmoji = (code) => {
  const emojiMap = {
    0: '☀️',   // Clear
    1: '🌤️',   // Mainly clear
    2: '⛅',   // Partly cloudy
    3: '☁️',   // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Rime fog
    51: '🌦️', // Light drizzle
    53: '🌦️', // Moderate drizzle
    55: '🌧️', // Dense drizzle
    56: '🌧️', // Freezing drizzle light
    57: '🌧️', // Freezing drizzle dense
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '⛈️',  // Heavy rain
    66: '🌧️', // Freezing rain light
    67: '🌧️', // Freezing rain heavy
    71: '🌨️', // Slight snow
    73: '❄️',  // Moderate snow
    75: '❄️',  // Heavy snow
    77: '🌨️', // Snow grains
    80: '🌦️', // Rain showers slight
    81: '🌧️', // Rain showers moderate
    82: '⛈️',  // Rain showers violent
    85: '🌨️', // Snow showers slight
    86: '❄️',  // Snow showers heavy
    95: '⛈️',  // Thunderstorm
    96: '⛈️',  // Thunderstorm with hail
    99: '⛈️'   // Thunderstorm with heavy hail
  };
  
  return emojiMap[code] || '🌫️';
};

// Get weather advice based on conditions
export const getWeatherAdvice = (code) => {
  const adviceMap = {
    clear: "Perfect weather for outdoor activities! ☀️",
    cloudy: "Great day for a walk, no need for an umbrella! ☁️",
    drizzle: "Light rain expected - grab a light jacket! 🌦️",
    rain: "Don't forget your umbrella and raincoat! ☔",
    snow: "Bundle up warm and watch for slippery conditions! ❄️",
    storm: "Stay indoors if possible - severe weather alert! ⚡",
    fog: "Drive carefully - reduced visibility conditions! 🌫️",
    freezing: "Icy conditions expected - be extra careful! 🧊"
  };
  
  const category = getWeatherCategory(code);
  return adviceMap[category] || "Stay weather aware! 🌤️";
};

// Temperature conversion utilities
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

export const fahrenheitToCelsius = (fahrenheit) => {
  return (fahrenheit - 32) * 5/9;
};

// Wind direction helper
export const getWindDirection = (degrees) => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// UV Index helper
export const getUVLevel = (uvIndex) => {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-500' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-500' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-500' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-500' };
  return { level: 'Extreme', color: 'text-purple-500' };
};

// Air quality helper (if you have AQI data)
export const getAirQuality = (aqi) => {
  if (aqi <= 50) return { level: 'Good', color: 'text-green-500', bgColor: 'bg-green-50' };
  if (aqi <= 100) return { level: 'Moderate', color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'text-orange-500', bgColor: 'bg-orange-50' };
  if (aqi <= 200) return { level: 'Unhealthy', color: 'text-red-500', bgColor: 'bg-red-50' };
  return { level: 'Hazardous', color: 'text-purple-500', bgColor: 'bg-purple-50' };
};