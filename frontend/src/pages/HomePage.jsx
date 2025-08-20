// ========================================================================
// File: frontend/src/pages/HomePage.jsx (COMPLETE AND CORRECTED)
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
import { LoaderCircle, X, Sun, Cloud, CloudRain, Wind } from 'lucide-react';

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
  const { isLoading, error, fetchInitialData } = useWeatherStore();
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

  // --- THE FIX: Added the complete logic for isLoading ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <div className="relative w-24 h-24 mb-4">
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
        <p className="text-xl font-bold animate-pulse text-gray-800">{loadingMessages[currentMessageIndex]}</p>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment...</p>
      </div>
    );
  }
  
  // --- THE FIX: Added the complete logic for error ---
  if (error) {
    return (
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-red-500">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <button 
          onClick={fetchInitialData} 
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] min-h-[90vh] bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 flex flex-col p-6 animate-fade-in">
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

      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Weather Assistant</h3>
              <button onClick={() => setShowChatbot(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <GeminiChatbot />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default HomePage;
