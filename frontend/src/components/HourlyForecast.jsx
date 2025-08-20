// ========================================================================
// File: frontend/src/components/HourlyForecast.jsx (UPDATED VERSION)
// Purpose: Hourly forecast with refined design
// ========================================================================
import { useWeatherStore } from '../state/weatherStore';
import { getWeatherIcon } from '../utils/weatherUtils.jsx';

function HourlyForecast() {
  const { weatherData } = useWeatherStore();

  if (!weatherData) return null;

  const { hourly } = weatherData;
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(time => new Date(time) > now);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4">Hourly Forecast</h3>
      <div className="flex overflow-x-auto space-x-6 pb-2">
        {hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, index) => {
          const actualIndex = currentHourIndex + index;
          const { icon } = getWeatherIcon(hourly.weather_code[actualIndex]);
          return (
            <div key={time} className="flex flex-col items-center flex-shrink-0 p-3 rounded-lg hover:bg-gray-50 min-w-[70px] transition-colors">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(time).toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true })}
              </p>
              <div className="mb-3 scale-90">{icon}</div>
              <p className="font-semibold text-gray-800">{Math.round(hourly.temperature_2m[actualIndex])}°</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default HourlyForecast;
