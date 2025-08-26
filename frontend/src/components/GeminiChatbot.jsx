// File: src/components/GeminiChatbot.jsx (FULLY CORRECTED)
import { useState, useEffect, useRef } from "react";
import { Send, LoaderCircle, MapPin } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useWeatherStore } from "../state/weatherStore";

function GeminiChatbot() {
  const { 
    aiResponse, 
    isChatLoading, 
    askAi, 
    location, 
    locationPermissionState,
    requestLocationPermission 
  } = useWeatherStore();

  const [inputValue, setInputValue] = useState("");
  const [currentLocationKey, setCurrentLocationKey] = useState(null);
  const chatEndRef = useRef(null);

  // Disable body scroll while chat is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiResponse, isChatLoading]);

  // Trigger weather report only when location changes
  useEffect(() => {
    if (!location) return;
    const newLocationKey = `${location.lat}-${location.lon}`;
    if (currentLocationKey === newLocationKey) return; // Prevent double requests
    setCurrentLocationKey(newLocationKey);

    console.log('Location changed, requesting fresh weather report for:', location.name);

    askAi(`Give me a detailed weather report for ${location.name}. Include current conditions, hourly forecast, and any weather alerts.`);
  }, [location, currentLocationKey, askAi]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    askAi(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  // Welcome message based on location
  const getWelcomeMessage = () => {
    if (location) return `Hello! I'm your weather assistant for ${location.name}. Ask me anything about the weather! 🌤️`;
    return "Hello! Ask me anything about the weather! 🌤️";
  };

  // Location status messages
  const getLocationStatusMessage = () => {
    if (location) return null;
    switch (locationPermissionState) {
      case 'pending':
        return { message: "🔍 Getting your location for accurate weather data...", color: "text-blue-600 bg-blue-50 border-blue-200" };
      case 'denied':
        return { message: "📍 Location access denied. Search for a city to get weather data.", color: "text-orange-600 bg-orange-50 border-orange-200", action: true };
      case 'unavailable':
        return { message: "🌍 Location unavailable. Please search for your city manually.", color: "text-gray-600 bg-gray-50 border-gray-200" };
      default:
        return { message: "📍 Enable location access for personalized weather updates.", color: "text-blue-600 bg-blue-50 border-blue-200", action: true };
    }
  };

  const locationStatus = getLocationStatusMessage();

  // Suggested prompts
  const getSuggestedPrompts = () => {
    const basePrompts = ["Will it rain today?", "What's the temperature tomorrow?", "Should I carry an umbrella?", "How's the air quality?"];
    if (location) {
      return [
        `Weather forecast for ${location.name}`,
        "What should I wear today?",
        "Is it good weather for outdoor activities?",
        "Any weather warnings for today?"
      ];
    }
    return basePrompts;
  };

  const suggestedPrompts = getSuggestedPrompts();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Location Header */}
        {location ? (
          <div className="text-center py-2 px-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center gap-1">
              <MapPin size={14} className="text-green-600" />
              <p className="text-xs text-green-700 font-medium">
                Weather Assistant for {location.name}
              </p>
            </div>
          </div>
        ) : locationStatus && (
          <div className={`text-center py-2 px-3 rounded-lg border ${locationStatus.color}`}>
            <p className="text-xs font-medium">{locationStatus.message}</p>
            {locationStatus.action && (
              <button
                onClick={requestLocationPermission}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline flex items-center justify-center gap-1 mx-auto"
              >
                <MapPin size={12} /> Enable Location
              </button>
            )}
          </div>
        )}

        {/* Chat Content */}
        {isChatLoading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <LoaderCircle size={18} className="animate-spin" />
            <span>MausamMate is thinking...</span>
          </div>
        ) : aiResponse && aiResponse !== "Hello! Ask me anything about the weather..." ? (
          <div className="text-gray-700 text-sm leading-relaxed">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-800">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-gray-800">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-gray-800">{children}</h3>,
              }}
            >
              {aiResponse}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-gray-500 text-sm text-center py-4">{getWelcomeMessage()}</div>
            {location && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Try asking:</p>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(prompt);
                        setTimeout(() => {
                          askAi(prompt);
                          setInputValue("");
                        }, 100);
                      }}
                      className="text-left p-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 p-4 border-t border-gray-200 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={location ? `Ask about weather in ${location.name}...` : "e.g., Kal baarish hogi kya?"}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          disabled={isChatLoading}
        />
        {!location && locationPermissionState !== 'pending' && (
          <button
            onClick={requestLocationPermission}
            className="px-2 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Enable location for personalized weather"
          >
            <MapPin size={18} />
          </button>
        )}
        <button
          onClick={handleSend}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[44px]"
          disabled={isChatLoading || !inputValue.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

export default GeminiChatbot;
