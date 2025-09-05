// File: frontend/src/pages/HomePage.jsx (ENHANCED WITH MATERIAL 3 EXPRESSIVE DESIGN)
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
  <Sun key="sun" className="text-amber-500" />,
  <Cloud key="cloud" className="text-surface-variant" />,
  <CloudRain key="rain" className="text-primary" />,
  <Wind key="wind" className="text-tertiary" />,
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

  // Material 3 enhanced loading screen with dynamic color and elevation
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-on-surface bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container">
        {/* Material 3 App Logo with elevated container */}
        <div className="flex items-center gap-4 mb-12 p-6 bg-surface-container-high rounded-[28px] shadow-elevation-3 border border-outline-variant">
          <div className="relative">
            <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-20 w-20 drop-shadow-sm" />
            <div className="absolute -inset-2 bg-primary/10 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-5xl font-bold text-on-surface tracking-tight">MausamMate</h1>
            <p className="text-sm text-on-surface-variant mt-1 font-medium">Weather Intelligence</p>
          </div>
        </div>

        {/* Animated weather icons with Material 3 containers */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-primary-container/20 rounded-full animate-pulse"></div>
          {loadingIcons.map((icon, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 transform ${
                index === currentIconIndex 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-75 rotate-45'
              }`}
            >
              <div className="p-4 bg-surface-container-highest rounded-full shadow-elevation-2">
                {React.cloneElement(icon, { size: 72 })}
              </div>
            </div>
          ))}
        </div>

        {/* Material 3 Loading spinner with enhanced styling */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
          <LoaderCircle size={40} className="animate-spin text-primary relative z-10" />
        </div>

        {/* Material 3 Location status container */}
        <div className="text-center max-w-md px-6 mb-8">
          {locationPermissionState === 'pending' && (
            <div className="p-6 bg-tertiary-container border border-outline-variant rounded-[20px] mb-6 shadow-elevation-1">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 bg-tertiary rounded-full">
                  <MapPin size={20} className="text-on-tertiary" />
                </div>
                <p className="text-lg font-semibold text-on-tertiary-container">Location Permission Required</p>
              </div>
              <p className="text-sm text-on-tertiary-container/80 leading-relaxed">
                Please check your browser for location permission popup and click "Allow"
              </p>
            </div>
          )}
          <div className="p-6 bg-primary-container rounded-[20px] border border-outline-variant shadow-elevation-1">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2 bg-primary rounded-full animate-bounce">
                <MapPin size={20} className="text-on-primary" />
              </div>
              <p className="text-lg font-semibold text-on-primary-container">
                Please keep your device location turned on
              </p>
            </div>
            <p className="text-sm text-on-primary-container/80 leading-relaxed">
              We need your location to fetch accurate weather data for your area
            </p>
          </div>
        </div>

        {/* Material 3 Dynamic loading message */}
        <div className="text-center px-6">
          <p className="text-2xl font-bold text-primary mb-2 animate-pulse tracking-tight">
            {loadingMessages[currentMessageIndex]}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <p className="text-sm text-on-surface-variant ml-2">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Material 3 enhanced location permission prompt
  if (!location && !isLoading && (locationPermissionState === null || locationPermissionState === 'denied' || locationPermissionState === 'unavailable')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container p-6">
        {/* Material 3 Header with search bar */}
        <div className="w-full max-w-lg mb-12">
          <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-surface-container-high rounded-[28px] shadow-elevation-2">
            <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-16 w-16 drop-shadow-sm" />
            <div>
              <h1 className="text-4xl font-bold text-on-surface tracking-tight">MausamMate</h1>
              <p className="text-sm text-on-surface-variant font-medium">Weather Intelligence</p>
            </div>
          </div>
          <SearchBar />
        </div>
        
        {/* Material 3 enhanced location permission card */}
        <div className="max-w-md mx-auto text-center bg-surface-container-high rounded-[28px] shadow-elevation-3 border border-outline-variant overflow-hidden">
          {/* Header section */}
          <div className="p-8 bg-primary-container">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-elevation-2">
              <MapPin size={48} className="text-on-primary" />
            </div>
            <h2 className="text-3xl font-bold text-on-primary-container mb-3 tracking-tight">
              Enable Location Access
            </h2>
            <p className="text-on-primary-container/80 text-sm leading-relaxed">
              MausamMate needs your location to provide accurate weather information for your area. 
              This helps us give you personalized weather updates and forecasts.
            </p>
          </div>

          {/* Content section */}
          <div className="p-8">
            {/* Location permission status handling */}
            {locationPermissionState === 'denied' || error ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 text-error bg-error-container p-4 rounded-[16px] border border-outline-variant">
                  <AlertCircle size={20} />
                  <span className="text-sm font-semibold text-on-error-container">Location Access Denied</span>
                </div>
                
                <div className="bg-tertiary-container border border-outline-variant rounded-[20px] p-6 text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-tertiary rounded-full">
                      <RefreshCw size={16} className="text-on-tertiary" />
                    </div>
                    <p className="text-sm font-semibold text-on-tertiary-container">
                      How to enable location access:
                    </p>
                  </div>
                  <ol className="text-sm text-on-tertiary-container/80 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Look for the <strong className="text-on-tertiary-container">🔒</strong> or <strong className="text-on-tertiary-container">📍</strong> icon in your browser's address bar</li>
                    <li>Click on it and select <strong className="text-on-tertiary-container">"Allow"</strong> for location</li>
                    <li>Refresh the page or click the button below to try again</li>
                  </ol>
                </div>
                
                <button 
                  onClick={requestLocationPermission}
                  className="w-full px-6 py-4 bg-primary text-on-primary rounded-[20px] hover:bg-primary/90 hover:shadow-elevation-2 active:scale-98 transition-all text-sm font-semibold flex items-center justify-center gap-3 shadow-elevation-1"
                >
                  <RefreshCw size={20} />
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={requestLocationPermission}
                  className="w-full px-8 py-5 bg-primary text-on-primary rounded-[20px] hover:bg-primary/90 hover:shadow-elevation-3 active:scale-98 transition-all font-semibold text-base flex items-center justify-center gap-3 shadow-elevation-2"
                >
                  <MapPin size={24} />
                  Allow Location Access
                </button>
              </div>
            )}

            {/* Manual search option */}
            <div className="mt-8 pt-6 border-t border-outline-variant">
              <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                Don't want to share location? You can search manually for your city using the search bar above.
              </p>
            </div>

            {/* Privacy notice */}
            <div className="mt-6 p-4 bg-secondary-container rounded-[16px] border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-xs text-on-secondary font-bold">🔒</span>
                </div>
                <p className="text-sm font-semibold text-on-secondary-container">
                  Privacy Protected
                </p>
              </div>
              <p className="text-xs text-on-secondary-container/80 leading-relaxed">
                Your location data stays on your device and is only used to fetch weather information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Material 3 permission pending state
  if (!location && locationPermissionState === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container p-6">
        {/* Header with search bar */}
        <div className="w-full max-w-lg mb-12">
          <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-surface-container-high rounded-[28px] shadow-elevation-2">
            <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-16 w-16 drop-shadow-sm" />
            <div>
              <h1 className="text-4xl font-bold text-on-surface tracking-tight">MausamMate</h1>
              <p className="text-sm text-on-surface-variant font-medium">Weather Intelligence</p>
            </div>
          </div>
          <SearchBar />
        </div>
        
        <div className="max-w-md mx-auto text-center bg-surface-container-high rounded-[28px] shadow-elevation-3 border border-outline-variant p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
              <LoaderCircle size={48} className="animate-spin text-primary relative z-10" />
            </div>
            <p className="text-xl font-semibold text-primary mb-2">Waiting for location permission...</p>
          </div>
          
          <div className="bg-tertiary-container border border-outline-variant rounded-[20px] p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-tertiary rounded-full">
                <MapPin size={20} className="text-on-tertiary" />
              </div>
              <p className="text-sm font-semibold text-on-tertiary-container">
                Browser Permission Required
              </p>
            </div>
            <p className="text-sm text-on-tertiary-container/80 leading-relaxed">
              Please look for the location permission popup in your browser (usually near the address bar) and click <strong className="text-on-tertiary-container">"Allow"</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Material 3 enhanced error state
  if (error && !location && locationPermissionState !== 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container p-6">
        <div className="max-w-md mx-auto text-center bg-surface-container-high rounded-[28px] shadow-elevation-3 border border-outline-variant overflow-hidden">
          <div className="p-8 bg-error-container">
            <div className="w-20 h-20 bg-error rounded-full flex items-center justify-center mx-auto mb-6 shadow-elevation-2">
              <AlertCircle size={40} className="text-on-error" />
            </div>
            <h2 className="text-2xl font-bold text-on-error-container mb-3 tracking-tight">Oops! Something went wrong</h2>
            <p className="text-on-error-container/80 text-sm leading-relaxed">{error}</p>
          </div>
          
          <div className="p-8 space-y-4">
            <button 
              onClick={fetchInitialData} 
              className="w-full px-6 py-4 bg-primary text-on-primary rounded-[20px] hover:bg-primary/90 hover:shadow-elevation-2 active:scale-98 transition-all flex items-center gap-3 justify-center font-semibold shadow-elevation-1"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Or use the search bar to find your city manually
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Material 3 main app interface with enhanced styling
  return (
    <div className="w-full max-w-[1600px] min-h-[90vh] bg-surface-container/80 backdrop-blur-sm rounded-[32px] shadow-elevation-4 border border-outline-variant flex flex-col p-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-14 w-14 drop-shadow-sm" />
            <div className="absolute -inset-1 bg-primary/10 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-on-surface tracking-tight">MausamMate</h1>
            <p className="text-sm text-on-surface-variant font-medium">Weather Intelligence</p>
          </div>
          {location && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-on-tertiary-container bg-tertiary-container px-4 py-2 rounded-full border border-outline-variant shadow-elevation-1">
              <MapPin size={16} className="text-tertiary" />
              <span className="font-medium">{location.name}</span>
            </div>
          )}
        </div>
        <SearchBar />
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-surface-container-high rounded-[24px] shadow-elevation-2 border border-outline-variant overflow-hidden">
            <MainDisplay />
          </div>
          <AskMausamButton onClick={() => setShowChatbot(true)} />
        </div>
        
        <div className="lg:col-span-8 space-y-6 lg:overflow-y-auto">
          <div className="bg-surface-container-high rounded-[24px] shadow-elevation-2 border border-outline-variant overflow-hidden">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="bg-surface-container-high rounded-[24px] shadow-elevation-2 border border-outline-variant overflow-hidden">
            {activeTab === 'Today' && <InfoGrid />}
            {activeTab === 'Hourly' && <HourlyForecast />}
            {activeTab === 'Daily' && <DailyForecast />}
          </div>
        </div>
      </main>

      {/* Material 3 mobile-friendly chatbot modal with enhanced styling */}
      {showChatbot && (
        <div className="fixed inset-0 bg-scrim/60 flex items-end sm:items-center justify-center p-0 sm:p-6 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-surface-container-high rounded-t-[28px] sm:rounded-[28px] shadow-elevation-5 border border-outline-variant w-full sm:w-auto sm:min-w-[420px] sm:max-w-[640px] h-[85vh] sm:h-[80vh] sm:max-h-[720px] flex flex-col overflow-hidden">
            {/* Material 3 Header */}
            <div className="p-6 border-b border-outline-variant bg-primary-container flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-on-primary-container tracking-tight">Weather Assistant</h3>
                <p className="text-sm text-on-primary-container/80 font-medium">Powered by AI</p>
              </div>
              <button 
                onClick={() => setShowChatbot(false)} 
                className="p-3 hover:bg-on-primary-container/10 rounded-full transition-all active:scale-95 shadow-elevation-1"
              >
                <X size={24} className="text-on-primary-container" />
              </button>
            </div>
            
            {/* Chatbot Content */}
            <div className="flex-1 overflow-hidden bg-surface-container">
              <GeminiChatbot />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;