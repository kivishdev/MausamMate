// File: frontend/src/pages/HomePage.jsx (ENHANCED WITH LOCATION FEATURES)
// ========================================================================
import { useEffect, useState } from 'react';
import React from 'react';
import { useWeatherStore } from '../state/weatherStore';
import MainDisplay from '../components/MainDisplay';
import InfoGrid from '../components/InfoGrid';
import GeminiChatbot from '../components/GeminiChatbot';
import SearchBar from '../components/SearchBar';
import Tabs from '../components/Tabs';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import AskMausamButton from '../components/AskMausamButton';
import LocationPermissionPrompt from '../components/LocationPermissionPrompt';
import { LoaderCircle, X, Sun, Cloud, CloudRain, Wind, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

// --- Loading screen logic ---
const loadingMessages = [
  'Detecting your location...',
  'Fetching latest satellite data...',
  'Consulting our AI weather expert...',
  'Analyzing atmospheric pressure...',
  'Preparing your personalized report...',
];

const loadingIcons = [
  <Sun key="sun" className="text-yellow-500" />,
  <Cloud key="cloud" className="text-gray-500" />,
  <CloudRain key="rain" className="text-blue-500" />,
  <Wind key="wind" className="text-green-500" />,
];
// -----------------------------

function HomePage() {
  const { 
    isLoading, 
    error, 
    fetchInitialData, 
    location, 
    locationPermissionState,
    requestLocationPermission 
  } = useWeatherStore();
  const [activeTab, setActiveTab] = useState('Today');
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    let messageInterval;
    let iconInterval;
    if (isLoading) {
      messageInterval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2000);
      iconInterval = setInterval(() => {
        setCurrentIconIndex((prevIndex) => (prevIndex + 1) % loadingIcons.length);
      }, 700);
    }
    return () => {
      clearInterval(messageInterval);
      clearInterval(iconInterval);
    };
  }, [isLoading]);

  // Enhanced loading screen with location status
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* App Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-16 w-16" />
          <h1 className="text-4xl font-bold text-gray-800">MausamMate</h1>
        </div>

        {/* Animated weather icons */}
        <div className="relative w-24 h-24 mb-6">
          {loadingIcons.map((icon, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                index === currentIconIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {React.cloneElement(icon, { size: 64 })}
            </div>
          ))}
        </div>

        {/* Loading spinner */}
        <div className="mb-4">
          <LoaderCircle size={32} className="animate-spin text-blue-500" />
        </div>

        {/* Location status */}
        <div className="text-center max-w-md px-4 mb-4">
          {locationPermissionState === 'pending' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm font-medium text-yellow-800 mb-1">📍 Location Permission Required</p>
              <p className="text-xs text-yellow-700">
                Please check your browser for location permission popup and click "Allow"
              </p>
            </div>
          )}
          <p className="text-lg font-medium text-blue-600 mb-2">
            📍 Please keep your device location turned on
          </p>
          <p className="text-sm text-gray-600">
            We need your location to fetch accurate weather data for your area
          </p>
        </div>

        {/* Dynamic loading message */}
        <p className="text-xl font-bold animate-pulse text-gray-800 text-center px-4">
          {loadingMessages[currentMessageIndex]}
        </p>
        
        {/* Wait message */}
        <p className="text-sm text-gray-500 mt-4 animate-pulse">
          Please wait a moment...
        </p>
      </div>
    );
  }
  
  // Enhanced location permission prompt
  if (!location && !isLoading && (locationPermissionState === null || locationPermissionState === 'denied' || locationPermissionState === 'unavailable')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        {/* Header with search bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-12 w-12" />
            <h1 className="text-3xl font-bold text-gray-800">MausamMate</h1>
          </div>
          <SearchBar />
        </div>
        
        {/* Enhanced location permission prompt */}
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-blue-200">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={40} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Enable Location Access
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              MausamMate needs your location to provide accurate weather information for your area. 
              This helps us give you personalized weather updates and forecasts.
            </p>
          </div>

          {/* Location permission status handling */}
          {locationPermissionState === 'denied' || error ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Location Access Denied</span>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-xs font-medium text-blue-800 mb-2">
                  🔧 How to enable location access:
                </p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Look for the <strong>🔒</strong> or <strong>📍</strong> icon in your browser's address bar</li>
                  <li>Click on it and select <strong>"Allow"</strong> for location</li>
                  <li>Refresh the page or click the button below to try again</li>
                </ol>
              </div>
              
              <button 
                onClick={requestLocationPermission}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={requestLocationPermission}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:scale-98 transition-all font-medium flex items-center justify-center gap-2"
              >
                <MapPin size={20} />
                Allow Location Access
              </button>
            </div>
          )}

          {/* Manual search option */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">
              Don't want to share location? You can search manually for your city using the search bar above.
            </p>
          </div>

          {/* Privacy notice */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium mb-1">
              🔒 Privacy Protected
            </p>
            <p className="text-xs text-green-600">
              Your location data stays on your device and is only used to fetch weather information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show permission pending state with enhanced UI
  if (!location && locationPermissionState === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        {/* Header with search bar */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-12 w-12" />
            <h1 className="text-3xl font-bold text-gray-800">MausamMate</h1>
          </div>
          <SearchBar />
        </div>
        
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-blue-200">
          <div className="flex flex-col items-center mb-4">
            <LoaderCircle size={40} className="animate-spin text-blue-500 mb-4" />
            <p className="text-lg font-medium text-blue-600 mb-2">Waiting for location permission...</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-700 font-medium mb-2">
              📍 Browser Permission Required
            </p>
            <p className="text-xs text-yellow-600">
              Please look for the location permission popup in your browser (usually near the address bar) and click <strong>"Allow"</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Enhanced error state
  if (error && !location && locationPermissionState !== 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-red-200">
          <div className="mb-4">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-500 mb-2">Oops! Something went wrong.</h2>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={fetchInitialData} 
              className="w-full px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            
            <div className="text-xs text-gray-500">
              Or use the search bar to find your city manually
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main app interface (unchanged)
  return (
    <div className="w-full max-w-[1600px] min-h-[90vh] bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 flex flex-col p-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-10 w-10" />
          <h1 className="text-3xl font-bold text-gray-800">MausamMate</h1>
          {location && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
              <MapPin size={12} className="text-blue-500" />
              <span>{location.name}</span>
            </div>
          )}
        </div>
        <SearchBar />
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex-1">
            <MainDisplay />
          </div>
          <AskMausamButton onClick={() => setShowChatbot(true)} />
        </div>
        
        <div className="lg:col-span-8 space-y-6 lg:overflow-y-auto">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'Today' && <InfoGrid />}
          {activeTab === 'Hourly' && <HourlyForecast />}
          {activeTab === 'Daily' && <DailyForecast />}
        </div>
      </main>

      {/* Mobile-friendly chatbot modal with responsive sizing */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:w-auto sm:min-w-[400px] sm:max-w-[600px] h-[85vh] sm:h-[80vh] sm:max-h-[700px] flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-3xl sm:rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Weather Assistant</h3>
              <button 
                onClick={() => setShowChatbot(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            {/* Chatbot Content */}
            <div className="flex-1 overflow-hidden">
              <GeminiChatbot />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;