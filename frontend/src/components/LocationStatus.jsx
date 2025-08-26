// File: frontend/src/components/LocationStatus.jsx
// Purpose: Reusable location status indicator component

import { MapPin, Loader2, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function LocationStatus({ 
  showText = true, 
  showIcon = true, 
  size = 'sm',
  variant = 'default' // 'default', 'compact', 'badge'
}) {
  const { location, locationPermissionState, requestLocationPermission } = useWeatherStore();

  // Size configurations
  const sizeConfig = {
    xs: { icon: 10, text: 'text-xs', padding: 'px-1 py-0.5' },
    sm: { icon: 12, text: 'text-xs', padding: 'px-2 py-1' },
    md: { icon: 14, text: 'text-sm', padding: 'px-3 py-1.5' },
    lg: { icon: 16, text: 'text-base', padding: 'px-4 py-2' }
  };

  const config = sizeConfig[size] || sizeConfig.sm;

  // Get location status
  const getLocationStatus = () => {
    if (!location) {
      switch (locationPermissionState) {
        case 'pending':
          return {
            icon: <Loader2 size={config.icon} className="animate-spin text-blue-500" />,
            text: 'Getting location...',
            color: 'text-blue-600 bg-blue-50 border-blue-200',
            clickable: false
          };
        case 'denied':
          return {
            icon: <AlertTriangle size={config.icon} className="text-orange-500" />,
            text: 'Location denied',
            color: 'text-orange-600 bg-orange-50 border-orange-200',
            clickable: true
          };
        case 'unavailable':
          return {
            icon: <AlertTriangle size={config.icon} className="text-gray-500" />,
            text: 'Location unavailable',
            color: 'text-gray-600 bg-gray-50 border-gray-200',
            clickable: false
          };
        default:
          return {
            icon: <MapPin size={config.icon} className="text-gray-500" />,
            text: 'No location',
            color: 'text-gray-600 bg-gray-50 border-gray-200',
            clickable: true
          };
      }
    }

    // Has location
    if (locationPermissionState === 'granted') {
      return {
        icon: <CheckCircle size={config.icon} className="text-green-500" />,
        text: location.name,
        color: 'text-green-600 bg-green-50 border-green-200',
        clickable: false
      };
    } else {
      return {
        icon: <Search size={config.icon} className="text-blue-500" />,
        text: location.name,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        clickable: false
      };
    }
  };

  const status = getLocationStatus();

  const handleClick = () => {
    if (status.clickable && !location) {
      requestLocationPermission();
    }
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return `inline-flex items-center gap-1 ${config.padding} rounded-full border ${status.color} ${config.text}`;
      case 'badge':
        return `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.color} border`;
      default:
        return `flex items-center gap-2 ${config.padding} rounded-lg ${status.color} ${config.text}`;
    }
  };

  const Component = status.clickable ? 'button' : 'div';

  return (
    <Component
      onClick={handleClick}
      className={`
        ${getVariantStyles()}
        ${status.clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        transition-all duration-200
      `}
      title={status.clickable ? 'Click to enable location access' : status.text}
    >
      {showIcon && status.icon}
      {showText && (
        <span className={`${variant === 'compact' ? 'hidden sm:inline' : ''} truncate max-w-32`}>
          {status.text}
        </span>
      )}
    </Component>
  );
}

export default LocationStatus;