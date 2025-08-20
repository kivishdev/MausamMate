// File: frontend/src/components/GeminiChatbot.jsx

// Purpose: A clean, text-only chat interface with Markdown support for AI responses.

import { useState } from 'react';
import { Send, LoaderCircle } from 'lucide-react';
// 1. Import ReactMarkdown
import ReactMarkdown from 'react-markdown';
import { useWeatherStore } from '../state/weatherStore';

function GeminiChatbot() {
  const { aiResponse, isChatLoading, askAi } = useWeatherStore();
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      askAi(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Ask MausamMate</h3>

      <div className="bg-white p-4 rounded-lg min-h-[100px] border mb-4">
        {isChatLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <LoaderCircle size={20} className="animate-spin" />
            <span>MausamMate is thinking...</span>
          </div>
        ) : (
          // 2. Use ReactMarkdown to render aiResponse
          // Add basic styling for common markdown elements if needed
          <div className="prose prose-sm max-w-none text-gray-600">
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Kal baarish hogi kya?"
          className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isChatLoading}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
          disabled={isChatLoading || !inputValue.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default GeminiChatbot;