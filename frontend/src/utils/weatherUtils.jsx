// File: frontend/src/utils/weatherUtils.js
// Purpose: A helper function to convert WMO weather codes into icons and descriptions.

import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, Haze, CloudFog } from 'lucide-react';

export const getWeatherIcon = (code) => {
  const props = { size: 64, className: "text-gray-700" };
  switch (code) {
    case 0: return { icon: <Sun {...props} className="text-yellow-500" />, description: "Clear sky" };
    case 1:
    case 2:
    case 3: return { icon: <Cloud {...props} />, description: "Mainly clear" };
    case 45:
    case 48: return { icon: <CloudFog {...props} />, description: "Fog" };
    case 51:
    case 53:
    case 55: return { icon: <CloudDrizzle {...props} className="text-blue-400" />, description: "Drizzle" };
    case 61:
    case 63:
    case 65: return { icon: <CloudRain {...props} className="text-blue-500" />, description: "Rain" };
    case 80:
    case 81:
    case 82: return { icon: <CloudRain {...props} className="text-blue-600" />, description: "Rain showers" };
    case 95:
    case 96:
    case 99: return { icon: <CloudLightning {...props} className="text-yellow-400" />, description: "Thunderstorm" };
    default: return { icon: <Haze {...props} />, description: "Hazy" };
  }
};
