// File: frontend/src/components/InfoCard.jsx
// Purpose: Enhanced info card with severity levels, better animations, and contextual styling

import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

function InfoCard({ 
  icon, 
  title, 
  value, 
  description, 
  children, 
  severity = 'low',
  trend = null,
  alert = null,
  className = ''
}) {
  
  // Get severity-based styling
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high':
        return {
          card: 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50',
          header: 'text-red-600',
          value: 'text-red-700',
          description: 'text-red-600'
        };
      case 'medium':
        return {
          card: 'border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50',
          header: 'text-orange-600',
          value: 'text-orange-700',
          description: 'text-orange-600'
        };
      case 'low':
      default:
        return {
          card: 'border-gray-100 bg-white',
          header: 'text-gray-500',
          value: 'text-gray-800',
          description: 'text-gray-500'
        };
    }
  };

  const severityStyles = getSeverityStyles(severity);

  // Get trend indicator
  const getTrendIndicator = (trend) => {
    if (!trend) return null;
    
    const trendConfig = {
      up: { icon: '↗️', color: 'text-green-600', bg: 'bg-green-100' },
      down: { icon: '↘️', color: 'text-red-600', bg: 'bg-red-100' },
      stable: { icon: '➡️', color: 'text-gray-600', bg: 'bg-gray-100' }
    };

    const config = trendConfig[trend.direction] || trendConfig.stable;

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
        <span>{config.icon}</span>
        <span>{trend.value}</span>
      </div>
    );
  };

  return (
    <div className={`
      rounded-xl p-4 shadow-sm border transition-all duration-300 
      hover:shadow-md hover:-translate-y-0.5 group
      ${severityStyles.card}
      ${className}
    `}>
      
      {/* Header with Icon and Title */}
      <div className={`
        flex items-center justify-between text-xs font-medium mb-3 uppercase tracking-wide
        ${severityStyles.header}
      `}>
        <div className="flex items-center gap-2">
          <div className="group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          <span>{title}</span>
        </div>
        
        {/* Severity Indicator */}
        {severity === 'high' && (
          <AlertTriangle size={14} className="text-red-500 animate-pulse" />
        )}
        {severity === 'medium' && (
          <Info size={14} className="text-orange-500" />
        )}
        {severity === 'low' && trend && (
          <CheckCircle size={14} className="text-green-500" />
        )}
      </div>

      {/* Content Area */}
      <div className="space-y-2">
        {/* Main Value with Trend */}
        {value && (
          <div className="flex items-center justify-between">
            <p className={`text-2xl font-semibold ${severityStyles.value} transition-colors duration-200`}>
              {value}
            </p>
            {getTrendIndicator(trend)}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className={`text-sm ${severityStyles.description} leading-relaxed`}>
            {description}
          </p>
        )}

        {/* Custom Children Content */}
        {children && (
          <div className="pt-1">
            {children}
          </div>
        )}

        {/* Alert Message */}
        {alert && (
          <div className={`
            flex items-start gap-2 p-2 rounded-lg text-xs
            ${severity === 'high' ? 'bg-red-100 border border-red-200 text-red-700' :
              severity === 'medium' ? 'bg-orange-100 border border-orange-200 text-orange-700' :
              'bg-blue-100 border border-blue-200 text-blue-700'
            }
          `}>
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{alert}</span>
          </div>
        )}
      </div>

      {/* Loading State Overlay (if needed) */}
      {/* You can add loading states here if needed */}
    </div>
  );
}

export default InfoCard;