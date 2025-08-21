// File: src/components/GeminiChatbot.jsx
import { useState, useEffect, useRef } from "react";
import { Send, LoaderCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useWeatherStore } from "../state/weatherStore";

function GeminiChatbot() {
  const { aiResponse, isChatLoading, askAi } = useWeatherStore();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = { type: "user", text: inputValue };
      setMessages((prev) => [...prev, newMessage]);
      askAi(inputValue);
      setInputValue("");
    }
  };

  // Push AI response as message when it changes
  useEffect(() => {
    if (aiResponse) {
      setMessages((prev) => [...prev, { type: "ai", text: aiResponse }]);
    }
  }, [aiResponse]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md ${
              msg.type === "user"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white ml-auto"
                : "bg-white text-gray-800 mr-auto"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}

        {isChatLoading && (
          <div className="flex items-center gap-2 text-gray-500 animate-pulse">
            <LoaderCircle size={20} className="animate-spin text-blue-500" />
            <span>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            disabled={isChatLoading}
          />
          <button
            onClick={handleSend}
            className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isChatLoading || !inputValue.trim()}
          >
            {isChatLoading ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeminiChatbot;
