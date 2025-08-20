// ========================================================================
// File: frontend/src/pages/HomePage.jsx (ENHANCED VERSION)
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
import { LoaderCircle, X, Sun, Cloud, CloudRain, Wind, MapPin, Satellite, Bot, Gauge } from 'lucide-react';

// --- Enhanced loading screen with weather-themed messages ---
const loadingSteps = [
  {
    message: '🌍 Detecting your location...',
    submessage: 'Getting your precise coordinates for accurate weather data',
    icon: <MapPin className="text-blue-600" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    message: '🛰️ Fetching satellite data...',
    submessage: 'Accessing real-time weather satellites and radar imagery',
    icon: <Satellite className="text-green-600" />,
    color: 'from-green-500 to-emerald-500'
  },
  {
    message: '🤖 Consulting AI weather expert...',
    submessage: 'Our AI is analyzing millions of weather patterns',
    icon: <Bot className="text-purple-600" />,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    message: '📊 Analyzing atmospheric data...',
    submessage: 'Processing pressure, humidity, and wind patterns',
    icon: <Gauge className="text-orange-600" />,
    color: 'from-orange-500 to-red-500'
  },
  {
    message: '✨ Preparing your forecast...',
    submessage: 'Creating your personalized weather experience',
    icon: <Sun className="text-yellow-600" />,
    color: 'from-yellow-500 to-orange-500'
  },
];

const floatingIcons = [
  <Sun key="sun" className="text-yellow-400" />,
  <Cloud key="cloud" className="text-gray-400" />,
  <CloudRain key="rain" className="text-blue-400" />,
  <Wind key="wind" className="text-green-400" />,
];
// -----------------------------

function HomePage() {
  const { isLoading, error, fetchInitialData } = useWeatherStore();
  const [activeTab, setActiveTab] = useState('Today');
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Enhanced loading animation with progress
  useEffect(() => {
    let stepInterval;
    let progressInterval;
    
    if (isLoading) {
      // Step progression
      stepInterval = setInterval(() => {
        setCurrentStepIndex((prevIndex) => (prevIndex + 1) % loadingSteps.length);
      }, 2500);

      // Smooth progress bar
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 95 ? 20 : newProgress;
        });
      }, 200);
    } else {
      setProgress(0);
      setCurrentStepIndex(0);
    }

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  // Prevent body scroll when chatbot is open
  useEffect(() => {
    if (showChatbot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showChatbot]);

  // Enhanced loading screen with weather animation
  if (isLoading) {
    const currentStep = loadingSteps[currentStepIndex];
    
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex flex-col items-center justify-center overflow-hidden">
        {/* Floating background icons */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingIcons.map((icon, index) => (
            <div
              key={index}
              className="absolute animate-bounce opacity-10"
              style={{
                left: `${20 + index * 15}%`,
                top: `${10 + index * 20}%`,
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + index}s`
              }}
            >
              {React.cloneElement(icon, { size: 40 + index * 10 })}
            </div>
          ))}
        </div>

        {/* Main loading content */}
        <div className="relative z-10 text-center max-w-md mx-auto p-8">
          {/* Logo and title */}
          <div className="mb-8">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <img 
                src="/pwa-192x192.png" 
                alt="MausamMate" 
                className="w-full h-full animate-pulse"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">MausamMate</h1>
            <p className="text-gray-600">Your AI Weather Companion</p>
          </div>

          {/* Current step indicator */}
          <div className="mb-8">
            <div className={`relative mx-auto w-24 h-24 mb-6 bg-gradient-to-r ${currentStep.color} rounded-full p-6 shadow-lg`}>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                {React.cloneElement(currentStep.icon, { size: 32 })}
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-spin border-t-white"></div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2 animate-fade-in">
              {currentStep.message}
            </h2>
            <p className="text-gray-600 text-sm animate-fade-in">
              {currentStep.submessage}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{Math.round(progress)}% complete</p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center space-x-2">
            {loadingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStepIndex
                    ? 'bg-blue-500 scale-125'
                    : index < currentStepIndex
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Fun weather fact */}
        <div className="absolute bottom-8 text-center max-w-sm mx-auto px-4">
          <p className="text-xs text-gray-500 italic">
            💡 Did you know? Weather satellites orbit Earth at 35,786 km above the equator!
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Weather data unavailable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchInitialData} 
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
          >
            🔄 Try Again
          </button>
          <p className="text-xs text-gray-500 mt-4">
            Check your internet connection and location permissions
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Homepage - Fixed when chatbot is open */}
      <div 
        className={`w-full max-w-[1600px] min-h-[90vh] bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 flex flex-col p-6 animate-fade-in transition-all duration-300 ${
          showChatbot ? 'blur-sm scale-95 pointer-events-none' : ''
        }`}
      >
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img src="/pwa-192x192.png" alt="MausamMate Logo" className="h-10 w-10" />
            <h1 className="text-3xl font-bold text-gray-800">MausamMate</h1>
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
      </div>

      {/* Enhanced Chatbot Modal - Fixed positioning */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-transparent rounded-2xl w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col animate-scale-in">
            {/* Modal header */}
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-4 rounded-t-2xl shadow-lg flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">MausamMate Assistant</h3>
                  <p className="text-blue-100 text-sm">Ask me anything about weather!</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChatbot(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            
            {/* Chatbot content */}
            <div className="flex-1 overflow-hidden rounded-b-2xl">
              <GeminiChatbot />
            </div>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default HomePage;