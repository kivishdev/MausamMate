// ========================================================================
// File: frontend/src/components/DailyForecast.jsx (UPDATED VERSION)
// Purpose: Daily forecast with improved layout
// ========================================================================
import { useWeatherStore } from '../state/weatherStore';
import { getWeatherIcon } from '../utils/weatherUtils.jsx';

function DailyForecast() {
  const { weatherData } = useWeatherStore();

  if (!weatherData) return null;

  const { daily } = weatherData;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4">10-Day Forecast</h3>
      <div className="space-y-3">
        {daily.time.slice(0, 10).map((time, index) => {
          const { icon, description } = getWeatherIcon(daily.weather_code[index]);
          return (
            <div key={time} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-medium w-20 text-gray-800">
                {index === 0 ? 'Today' : new Date(time).toLocaleDateString('en-IN', { weekday: 'short' })}
              </p>
              <div className="flex items-center gap-3 flex-1 justify-center">
                <div className="scale-75">{icon}</div>
                <span className="text-sm text-gray-600 hidden sm:block min-w-[100px] text-center">{description}</span>
              </div>
              <div className="text-right w-20">
                <span className="font-semibold text-gray-800">{Math.round(daily.temperature_2m_max[index])}°</span>
                <span className="text-gray-500 ml-1">{Math.round(daily.temperature_2m_min[index])}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default DailyForecast;

