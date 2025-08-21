// File: src/components/GeminiChatbot.jsx
import { useState, useEffect, useRef } from "react";
import { Send, LoaderCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useWeatherStore } from "../state/weatherStore";

function GeminiChatbot() {
  const { aiResponse, isChatLoading, askAi } = useWeatherStore();
  const [inputValue, setInputValue] = useState("");
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

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Messages - No bubbles, natural width */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isChatLoading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <LoaderCircle size={18} className="animate-spin" />
            <span>MausamMate is thinking...</span>
          </div>
        ) : aiResponse ? (
          <div className="text-gray-700 text-sm leading-relaxed">
            <ReactMarkdown 
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>
              }}
            >
              {aiResponse}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-gray-500 text-sm text-center py-8">
            Ask me anything about the weather! 🌤️
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
          placeholder="e.g., Kal baarish hogi kya?"
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