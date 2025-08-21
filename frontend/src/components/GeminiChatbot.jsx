// File: src/components/GeminiChatbot.jsx
import { useState, useEffect, useRef } from "react";
import { Send, LoaderCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useWeatherStore } from "../state/weatherStore";

function GeminiChatbot() {
  const { aiResponse, isChatLoading, askAi, location } = useWeatherStore();
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

  // Reset chat when location changes
  useEffect(() => {
    if (location) {
      const newLocationKey = `${location.lat}-${location.lon}`;
      
      // If location changed, trigger a fresh weather report
      if (currentLocationKey && currentLocationKey !== newLocationKey) {
        console.log('Location changed, requesting fresh weather report for:', location.name);
        
        // Ask for a fresh weather report for the new location
        askAi(`Give me a detailed weather report for ${location.name}. Include current conditions, hourly forecast, and any weather alerts.`);
      }
      
      setCurrentLocationKey(newLocationKey);
    }
  }, [location, currentLocationKey, askAi]);

  const handleSend = () => {
    if (inputValue.trim()) {
      askAi(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  // Get welcome message based on current location
  const getWelcomeMessage = () => {
    if (location) {
      return `Hello! I'm your weather assistant for ${location.name}. Ask me anything about the weather! 🌤️`;
    }
    return "Hello! Ask me anything about the weather! 🌤️";
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Messages - No bubbles, natural width */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Location Header */}
        {location && (
          <div className="text-center py-2 px-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 font-medium">
              Weather Assistant for {location.name}
            </p>
          </div>
        )}

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
          <div className="text-gray-500 text-sm text-center py-8">
            {getWelcomeMessage()}
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