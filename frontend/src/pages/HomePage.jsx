// File: frontend/src/pages/HomePage.jsx (PROPERLY ALIGNED ANDROID MATERIAL 3 VERSION)
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

// --- Loading screen configuration ---
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

function HomePage() {
  // ===== STATE AND STORE =====
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

  // ===== EFFECTS =====
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

  // ===== EVENT HANDLERS =====
  const handleRetry = async () => {
    try {
      await fetchInitialData();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const handleLocationRequest = async () => {
    try {
      await requestLocationPermission();
    } catch (error) {
      console.error('Location permission failed:', error);
    }
  };

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-800 bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-50/60 backdrop-blur-sm relative overflow-hidden">
        {/* Dynamic background particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_blue-400/10_0%,_transparent_50%),radial-gradient(circle_at_80%_20%,_purple-400/8_0%,_transparent_50%),radial-gradient(circle_at_40%_40%,_teal-400/6_0%,_transparent_50%)]"></div>
        
        {/* Material 3 App Logo with elevated glassmorphism container */}
        <div className="relative flex items-center gap-4 mb-12 p-8 bg-white/70 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/30 animate-fade-in">
          {/* Surface tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/3 to-transparent rounded-[32px]"></div>
          
          <div className="relative z-10">
            <div className="relative">
              <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-20 w-20 drop-shadow-lg" />
              {/* Animated glow ring */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-teal-500/20 rounded-full animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/25 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
            </div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
              MausamMate
            </h1>
            <p className="text-sm text-gray-600 mt-1 font-medium tracking-wide">Weather Intelligence • Material You</p>
          </div>
        </div>

        {/* Material 3 Enhanced Animated Weather Icons */}
        <div className="relative w-40 h-40 mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-teal-500/20 rounded-full animate-pulse"></div>
          {/* Inner rotating ring */}
          <div className="absolute inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-spin" style={{ animationDuration: '12s' }}></div>
          
          {loadingIcons.map((icon, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${
                index === currentIconIndex 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-75 rotate-45'
              }`}
            >
              <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-full shadow-xl border border-white/40">
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full"></div>
                {React.cloneElement(icon, { size: 80, className: `${icon.props.className} drop-shadow-sm relative z-10` })}
              </div>
            </div>
          ))}
        </div>

        {/* Material 3 Enhanced Loading Spinner */}
        <div className="mb-8 relative">
          {/* Multi-layered spinning rings */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-ping"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full animate-pulse"></div>
          <div className="relative">
            <LoaderCircle size={48} className="animate-spin text-blue-600 drop-shadow-sm" style={{ animationDuration: '1.5s' }} />
          </div>
        </div>

        {/* Material 3 Enhanced Location Status Cards */}
        <div className="text-center max-w-lg px-6 mb-8 space-y-4">
          {locationPermissionState === 'pending' && (
            <div className="relative p-6 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/60 rounded-[24px] shadow-xl animate-bounce">
              {/* Surface tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/3 rounded-[24px]"></div>
              
              <div className="relative flex items-center justify-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full shadow-lg">
                  <MapPin size={22} className="text-white drop-shadow-sm" />
                </div>
                <p className="text-lg font-bold text-yellow-800 tracking-tight">Location Permission Required</p>
              </div>
              <p className="text-sm text-yellow-700/90 leading-relaxed">
                Please check your browser for location permission popup and click "Allow"
              </p>
            </div>
          )}
          
          <div className="relative p-8 bg-blue-50/80 backdrop-blur-sm rounded-[28px] border border-blue-200/60 shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-teal-500/5 rounded-[28px]"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full"></div>
            
            <div className="relative flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-xl animate-bounce">
                  <MapPin size={24} className="text-white drop-shadow-sm" />
                </div>
                {/* Pulsing rings */}
                <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
                <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-800 to-purple-700 bg-clip-text text-transparent tracking-tight">
                Please keep your device location turned on
              </p>
            </div>
            <p className="text-sm text-blue-700/90 leading-relaxed relative">
              We need your location to fetch accurate weather data for your area
            </p>
          </div>
        </div>

        {/* Material 3 Enhanced Dynamic Loading Message */}
        <div className="text-center px-6 relative">
          <div className="relative mb-6 p-6 bg-white/60 backdrop-blur-sm rounded-[20px] border border-white/40 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-[20px]"></div>
            
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-3 animate-pulse tracking-tight relative">
              {loadingMessages[currentMessageIndex]}
            </p>
            
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-sm"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }}></div>
              <p className="text-sm text-gray-600 ml-3 font-medium">Please wait a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== LOCATION PERMISSION PROMPT STATE =====
  if (!location && !isLoading && (locationPermissionState === null || locationPermissionState === 'denied' || locationPermissionState === 'unavailable')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-50/60 backdrop-blur-sm p-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_blue-400/8_0%,_transparent_50%),radial-gradient(circle_at_75%_75%,_purple-400/6_0%,_transparent_50%)]"></div>
        
        {/* Header with search bar */}
        <div className="w-full max-w-lg mb-12 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8 p-6 bg-white/70 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/3 rounded-[32px]"></div>
            
            <div className="relative">
              <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-16 w-16 drop-shadow-lg" />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/15 rounded-full animate-pulse"></div>
            </div>
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent tracking-tight">
                MausamMate
              </h1>
              <p className="text-sm text-gray-600 font-medium tracking-wide">Weather Intelligence • Material You</p>
            </div>
          </div>
          <SearchBar />
        </div>
        
        {/* Material 3 Enhanced Location Permission Card */}
        <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/30 overflow-hidden relative z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/3 to-transparent rounded-[32px]"></div>
          
          {/* Header section with enhanced Material 3 styling */}
          <div className="relative p-10 bg-gradient-to-br from-blue-600/95 via-blue-600/90 to-purple-600/90 backdrop-blur-sm">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_white/10_0%,_transparent_70%),radial-gradient(circle_at_70%_70%,_white/5_0%,_transparent_70%)]"></div>
            
            <div className="relative">
              <div className="w-28 h-28 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/40">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full"></div>
                <MapPin size={56} className="text-blue-600 drop-shadow-sm relative z-10" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">
                Enable Location Access
              </h2>
              <p className="text-blue-100/90 text-sm leading-relaxed drop-shadow-sm">
                MausamMate needs your location to provide accurate weather information for your area. 
                This helps us give you personalized weather updates and forecasts.
              </p>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="relative p-8">
            {/* Location permission status handling with Material 3 enhancements */}
            {locationPermissionState === 'denied' || error ? (
              <div className="space-y-6">
                {/* Error Alert */}
                <div className="flex items-center justify-center gap-3 text-red-700 bg-red-50/80 backdrop-blur-sm p-5 rounded-[20px] border border-red-200/60 shadow-lg">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-md">
                    <AlertCircle size={20} className="text-white" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">Location Access Denied</span>
                </div>
                
                {/* Instructions Card */}
                <div className="relative bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-[24px] p-8 text-left shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/3 to-blue-500/3 rounded-[24px]"></div>
                  
                  <div className="relative flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full shadow-lg">
                      <RefreshCw size={18} className="text-white" />
                    </div>
                    <p className="text-base font-bold text-gray-800 tracking-tight">
                      How to enable location access:
                    </p>
                  </div>
                  
                  <ol className="text-sm text-gray-700 space-y-3 list-decimal list-inside leading-relaxed relative">
                    <li className="flex items-center gap-2">
                      <span>Look for the <strong className="text-gray-800 bg-gray-100 px-2 py-1 rounded text-xs">🔒</strong> or <strong className="text-gray-800 bg-gray-100 px-2 py-1 rounded text-xs">📍</strong> icon in your browser's address bar</span>
                    </li>
                    <li>Click on it and select <strong className="text-gray-800 bg-green-100 px-2 py-1 rounded text-xs">"Allow"</strong> for location</li>
                    <li>Refresh the page or click the button below to try again</li>
                  </ol>
                </div>
                
                {/* Enhanced Try Again Button */}
                <button 
                  onClick={handleLocationRequest}
                  className="group relative w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-[20px] hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl active:scale-95 transition-all duration-300 text-sm font-bold flex items-center justify-center gap-4 shadow-xl overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <div className="relative flex items-center gap-3">
                    <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="tracking-wide">Try Again</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Enhanced Allow Button */}
                <button 
                  onClick={handleLocationRequest}
                  className="group relative w-full px-10 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-[24px] hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-4 shadow-2xl overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-[24px] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center gap-4">
                    <div className="p-1 bg-white/20 rounded-full">
                      <MapPin size={28} className="drop-shadow-sm" />
                    </div>
                    <span className="tracking-wide drop-shadow-sm">Allow Location Access</span>
                  </div>
                </button>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50/80 backdrop-blur-sm rounded-[16px] border border-blue-200/60 shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                      <span className="text-white text-sm font-bold">⚡</span>
                    </div>
                    <p className="text-xs font-semibold text-blue-800 mb-1">Instant Updates</p>
                    <p className="text-xs text-blue-700/80">Real-time weather data</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50/80 backdrop-blur-sm rounded-[16px] border border-purple-200/60 shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-md">
                      <span className="text-white text-sm font-bold">🎯</span>
                    </div>
                    <p className="text-xs font-semibold text-purple-800 mb-1">Precise Location</p>
                    <p className="text-xs text-purple-700/80">Hyper-local forecasts</p>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Search Option */}
            <div className="mt-10 pt-8 border-t border-gray-200/60">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">✋</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">Alternative Option</p>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Don't want to share location? You can search manually for your city using the search bar above.
              </p>
            </div>

            {/* Enhanced Privacy Notice */}
            <div className="mt-8 relative p-6 bg-green-50/80 backdrop-blur-sm rounded-[20px] border border-green-200/60 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/3 rounded-[20px]"></div>
              
              <div className="relative flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs text-white font-bold">🔒</span>
                </div>
                <p className="text-sm font-bold text-green-800 tracking-tight">
                  Privacy Protected
                </p>
              </div>
              <p className="text-xs text-green-700/90 leading-relaxed relative">
                Your location data stays on your device and is only used to fetch weather information. We follow Material You privacy guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== PERMISSION PENDING STATE =====
  if (!location && locationPermissionState === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-50/60 backdrop-blur-sm p-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_blue-400/8_0%,_transparent_60%),radial-gradient(circle_at_70%_80%,_purple-400/6_0%,_transparent_60%)]"></div>
        
        {/* Header with search bar */}
        <div className="w-full max-w-lg mb-12 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8 p-6 bg-white/70 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/3 rounded-[32px]"></div>
            
            <div className="relative">
              <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-16 w-16 drop-shadow-lg" />
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/15 rounded-full animate-pulse"></div>
            </div>
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent tracking-tight">
                MausamMate
              </h1>
              <p className="text-sm text-gray-600 font-medium tracking-wide">Weather Intelligence • Material You</p>
            </div>
          </div>
          <SearchBar />
        </div>
        
        {/* Enhanced Pending Card */}
        <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/30 p-10 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/3 to-transparent rounded-[32px]"></div>
          
          <div className="relative flex flex-col items-center mb-8">
            {/* Enhanced loading animation */}
            <div className="relative mb-8">
              {/* Multiple spinning rings */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-teal-500/20 rounded-full animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full animate-ping"></div>
              
              <div className="relative">
                <LoaderCircle size={56} className="animate-spin text-blue-600 drop-shadow-lg relative z-10" style={{ animationDuration: '2s' }} />
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Waiting for permission...
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
          
          {/* Enhanced instruction card */}
          <div className="relative bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/60 rounded-[24px] p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-orange-400/3 to-transparent rounded-[24px]"></div>
            
            <div className="relative flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full shadow-lg animate-bounce">
                  <MapPin size={24} className="text-white drop-shadow-sm" />
                </div>
                <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping"></div>
              </div>
              <p className="text-lg font-bold text-yellow-800 tracking-tight">
                Browser Permission Required
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-yellow-700/90 leading-relaxed font-medium">
                Please look for the location permission popup in your browser
              </p>
              
              <div className="flex items-center justify-center gap-2 text-xs text-yellow-600 font-semibold">
                <span className="bg-yellow-100 px-2 py-1 rounded">Usually near the address bar</span>
                <span>→</span>
                <span className="bg-green-100 px-2 py-1 rounded">Click "Allow"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error && !location && locationPermissionState !== 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-50/60 backdrop-blur-sm p-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,_red-400/8_0%,_transparent_50%),radial-gradient(circle_at_60%_40%,_orange-400/6_0%,_transparent_50%)]"></div>
        
        <div className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/30 overflow-hidden relative z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-orange-600/3 to-transparent rounded-[32px]"></div>
          
          <div className="relative p-8 bg-gradient-to-br from-red-500/95 via-red-600/90 to-orange-600/90 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_white/10_0%,_transparent_70%),radial-gradient(circle_at_70%_70%,_white/5_0%,_transparent_70%)]"></div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/40">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/5 rounded-full"></div>
                <AlertCircle size={40} className="text-red-600 drop-shadow-sm relative z-10" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight drop-shadow-sm">Oops! Something went wrong</h2>
              <p className="text-red-100/90 text-sm leading-relaxed drop-shadow-sm">{error}</p>
            </div>
          </div>
          
          <div className="relative p-8 space-y-4">
            <button 
              onClick={handleRetry} 
              className="group relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-[20px] hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center gap-3 justify-center font-bold shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <div className="relative flex items-center gap-3">
                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="tracking-wide">Try Again</span>
              </div>
            </button>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Or use the search bar to find your city manually
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN APPLICATION INTERFACE =====
  return (
    <div className="w-full max-w-[1600px] min-h-[90vh] bg-white/70 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/30 flex flex-col p-8 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 via-purple-600/2 to-teal-600/3 rounded-[32px]"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/5 to-transparent rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/5 to-transparent rounded-full"></div>
      
      {/* ===== ENHANCED HEADER ===== */}
      <header className="relative flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-14 w-14 drop-shadow-lg" />
            {/* Animated glow rings */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-teal-500/20 rounded-full animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
              MausamMate
            </h1>
            <p className="text-sm text-gray-600 font-medium tracking-wide">Weather Intelligence • Material You</p>
          </div>
          
          {location && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-blue-800 bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/60 shadow-lg">
              <div className="p-1 bg-blue-600 rounded-full shadow-sm">
                <MapPin size={14} className="text-white" />
              </div>
              <span className="font-semibold tracking-wide">{location.name}</span>
            </div>
          )}
        </div>
        <SearchBar />
      </header>
      
      {/* ===== ENHANCED MAIN CONTENT GRID ===== */}
      <main className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 z-10">
        {/* Left Column - Main Display & AI Button */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-[24px] shadow-xl border border-white/40 overflow-hidden relative">
            {/* Surface tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 to-purple-600/2 rounded-[24px]"></div>
            <div className="relative z-10">
              <MainDisplay />
            </div>
          </div>
          
          {/* Enhanced Ask Mausam Button */}
          <div className="relative">
            <AskMausamButton onClick={() => setShowChatbot(true)} />
          </div>
        </div>
        
        {/* Right Column - Tabs & Content */}
        <div className="lg:col-span-8 space-y-6 lg:overflow-y-auto">
          {/* Enhanced Tabs Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] shadow-xl border border-white/40 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 to-purple-600/2 rounded-[24px]"></div>
            <div className="relative z-10">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
          
          {/* Enhanced Content Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[24px] shadow-xl border border-white/40 overflow-hidden relative min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 to-purple-600/2 rounded-[24px]"></div>
            <div className="relative z-10">
              {activeTab === 'Today' && <InfoGrid />}
              {activeTab === 'Hourly' && <HourlyForecast />}
              {activeTab === 'Daily' && <DailyForecast />}
            </div>
          </div>
        </div>
      </main>

      {/* ===== ANDROID MATERIAL 3 GLASSMORPHISM CHATBOT MODAL ===== */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 z-50 animate-fade-in">
          {/* Glassmorphism overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-teal-500/10"></div>
          
          {/* Modal with Material 3 glassmorphism */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-white/20 w-full sm:w-auto sm:min-w-[420px] sm:max-w-[640px] h-[85vh] sm:h-[80vh] sm:max-h-[720px] flex flex-col overflow-hidden animate-slide-up-fade">
            {/* Material 3 Surface Tint Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/3 pointer-events-none rounded-t-[28px] sm:rounded-[28px]"></div>
            
            {/* Header with Material 3 styling */}
            <div className="relative p-6 border-b border-white/20 bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-sm flex justify-between items-center">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_white/10_0%,_transparent_50%),radial-gradient(circle_at_80%_20%,_white/5_0%,_transparent_50%)]"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">Weather Assistant</h3>
                <p className="text-sm text-blue-100/90 font-medium">Powered by AI • Material You</p>
              </div>
              
              {/* Close button with Material 3 ripple effect */}
              <button 
                onClick={() => setShowChatbot(false)} 
                className="relative z-10 p-3 hover:bg-white/20 active:bg-white/30 rounded-full transition-all duration-200 active:scale-95 group"
              >
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full bg-white/0 group-active:bg-white/20 group-active:animate-ping"></div>
                <X size={24} className="text-white drop-shadow-sm relative z-10" />
              </button>
            </div>
            
            {/* Chatbot Content with glassmorphism */}
            <div className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50/80 via-white/60 to-blue-50/40 backdrop-blur-sm relative">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_25%_25%,_blue-500/5_0%,_transparent_50%),radial-gradient(circle_at_75%_75%,_purple-500/3_0%,_transparent_50%)]"></div>
              
              {/* Content */}
              <div className="relative z-10 h-full">
                <GeminiChatbot />
              </div>
            </div>
            
            {/* Bottom edge glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/30 to-teal-500/50"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;