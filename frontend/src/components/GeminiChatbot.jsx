// File: src/components/GeminiChatbot.jsx (Material 3 Expressive Design)
import { useState, useEffect, useRef } from "react";
import { Send, LoaderCircle, MapPin, Sparkles, MessageCircle, Zap } from "lucide-react";
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
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Disable body scroll while chat is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Auto-scroll to latest message with enhanced behavior
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiResponse, isChatLoading]);

  // Enhanced typing effect when loading
  useEffect(() => {
    if (isChatLoading) {
      setIsTyping(true);
    } else {
      const timer = setTimeout(() => setIsTyping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isChatLoading]);

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

  // Enhanced welcome message with Material 3 styling
  const getWelcomeMessage = () => {
    if (location) return `Hello! I'm your AI weather assistant for ${location.name}. Ask me anything about the weather! 🌤️`;
    return "Hello! I'm your AI weather assistant. Ask me anything about the weather! 🌤️";
  };

  // Enhanced location status messages with Material 3 colors
  const getLocationStatusMessage = () => {
    if (location) return null;
    switch (locationPermissionState) {
      case 'pending':
        return { 
          message: "🔍 Getting your location for accurate weather data...", 
          styling: "text-on-tertiary-container bg-tertiary-container border-outline-variant",
          icon: LoaderCircle,
          iconClass: "animate-spin text-tertiary"
        };
      case 'denied':
        return { 
          message: "📍 Location access denied. Search for a city to get weather data.", 
          styling: "text-on-error-container bg-error-container border-outline-variant", 
          action: true,
          icon: MapPin,
          iconClass: "text-error"
        };
      case 'unavailable':
        return { 
          message: "🌍 Location unavailable. Please search for your city manually.", 
          styling: "text-on-surface-variant bg-surface-variant border-outline-variant",
          icon: MapPin,
          iconClass: "text-on-surface-variant"
        };
      default:
        return { 
          message: "📍 Enable location access for personalized weather updates.", 
          styling: "text-on-primary-container bg-primary-container border-outline-variant", 
          action: true,
          icon: MapPin,
          iconClass: "text-primary"
        };
    }
  };

  const locationStatus = getLocationStatusMessage();

  // Enhanced suggested prompts with location awareness
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
    <div className="flex flex-col h-full w-full bg-surface-container">
      {/* Enhanced Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-surface-container to-surface-container-low">
        {/* Enhanced Location Header */}
        {location ? (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 px-4 py-3 bg-primary-container rounded-[20px] border border-outline-variant shadow-elevation-1">
              <div className="p-2 bg-primary rounded-[8px]">
                <MapPin size={16} className="text-on-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-primary-container">
                  Weather Assistant Active
                </p>
                <p className="text-xs text-on-primary-container/80 font-medium">
                  Location: {location.name}
                </p>
              </div>
            </div>
          </div>
        ) : locationStatus && (
          <div className="flex items-center justify-center">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-[20px] border shadow-elevation-1 ${locationStatus.styling} max-w-sm`}>
              <div className="p-2 bg-surface-container-highest rounded-[8px]">
                <locationStatus.icon size={16} className={locationStatus.iconClass} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">{locationStatus.message}</p>
                {locationStatus.action && (
                  <button
                    onClick={requestLocationPermission}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-surface-container-high rounded-[12px] border border-outline-variant hover:shadow-elevation-1 transition-all duration-200 active:scale-95"
                  >
                    <MapPin size={12} /> Enable Location
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Chat Content */}
        {isTyping || isChatLoading ? (
          <div className="flex justify-start">
            <div className="bg-secondary-container rounded-[20px] rounded-bl-[8px] px-6 py-4 max-w-[85%] border border-outline-variant shadow-elevation-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-full">
                  <Sparkles size={16} className="text-on-secondary" />
                </div>
                <div className="flex items-center gap-2">
                  <LoaderCircle size={18} className="animate-spin text-secondary" />
                  <span className="text-sm font-medium text-on-secondary-container">MausamMate is thinking...</span>
                </div>
              </div>
              {/* Typing animation */}
              <div className="flex items-center gap-1 mt-3">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        ) : aiResponse && aiResponse !== "Hello! Ask me anything about the weather..." ? (
          <div className="flex justify-start">
            <div className="bg-surface-container-highest rounded-[20px] rounded-bl-[8px] px-6 py-4 max-w-[90%] border border-outline-variant shadow-elevation-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary rounded-full">
                  <Sparkles size={16} className="text-on-primary" />
                </div>
                <div>
                  <span className="text-sm font-bold text-on-surface">MausamMate</span>
                  <p className="text-xs text-on-surface-variant font-medium">AI Weather Assistant</p>
                </div>
              </div>
              <div className="text-on-surface text-sm leading-relaxed">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-2 pl-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-2 pl-2">{children}</ol>,
                    li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
                    em: ({ children }) => <em className="italic text-on-surface-variant">{children}</em>,
                    code: ({ children }) => <code className="bg-surface-variant px-2 py-1 rounded-[8px] text-xs font-mono border border-outline-variant">{children}</code>,
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-primary tracking-tight">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mb-3 text-secondary tracking-tight">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-bold mb-2 text-tertiary tracking-tight">{children}</h3>,
                  }}
                >
                  {aiResponse}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Welcome Message */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center gap-4 p-8 bg-primary-container rounded-[24px] border border-outline-variant shadow-elevation-2 max-w-md mx-auto">
                <div className="p-4 bg-primary rounded-full shadow-elevation-1">
                  <MessageCircle size={32} className="text-on-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-primary-container mb-2 tracking-tight">
                    Welcome to MausamMate AI
                  </h3>
                  <p className="text-sm text-on-primary-container/80 leading-relaxed">
                    {getWelcomeMessage()}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Suggested Prompts */}
            {location && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 justify-center">
                  <Zap size={16} className="text-secondary" />
                  <p className="text-sm font-bold text-on-surface">Quick Questions</p>
                </div>
                <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
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
                      className="group text-left p-4 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant rounded-[16px] transition-all duration-200 hover:shadow-elevation-2 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-tertiary-container rounded-[8px] group-hover:bg-tertiary transition-colors duration-200">
                          <MessageCircle size={14} className="text-tertiary group-hover:text-on-tertiary" />
                        </div>
                        <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors duration-200">
                          {prompt}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Enhanced Input Bar with Material 3 styling */}
      <div className="p-6 border-t border-outline-variant bg-surface-container-high">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          {/* Enhanced Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={location ? `Ask about weather in ${location.name}...` : "e.g., Will it rain tomorrow?"}
              className="w-full px-4 py-3 pr-12 bg-surface-container-highest border border-outline-variant rounded-[24px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium text-on-surface placeholder:text-on-surface-variant shadow-elevation-1 transition-all duration-200"
              disabled={isChatLoading}
            />
            {/* Character indicator */}
            {inputValue.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs text-on-surface-variant font-medium">
                  {inputValue.length}
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Location Button */}
          {!location && locationPermissionState !== 'pending' && (
            <button
              onClick={requestLocationPermission}
              className="p-3 bg-tertiary-container text-tertiary hover:bg-tertiary hover:text-on-tertiary rounded-[16px] border border-outline-variant transition-all duration-200 hover:shadow-elevation-2 active:scale-95 shadow-elevation-1"
              title="Enable location for personalized weather"
            >
              <MapPin size={20} />
            </button>
          )}

          {/* Enhanced Send Button */}
          <button
            onClick={handleSend}
            className={`p-3 rounded-[16px] border border-outline-variant transition-all duration-200 flex items-center justify-center min-w-[52px] shadow-elevation-1 ${
              isChatLoading || !inputValue.trim()
                ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                : 'bg-primary text-on-primary hover:bg-primary/90 hover:shadow-elevation-3 active:scale-95'
            }`}
            disabled={isChatLoading || !inputValue.trim()}
          >
            {isChatLoading ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* Enhanced Input Helper Text */}
        <div className="flex items-center justify-between mt-3 px-2">
          <p className="text-xs text-on-surface-variant font-medium">
            {location ? `Getting weather for ${location.name}` : "Enable location for personalized results"}
          </p>
          {inputValue.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs text-primary font-semibold">Ready to send</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeminiChatbot;