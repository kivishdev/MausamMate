// File: frontend/src/components/GeminiChatbot.jsx
// Purpose: A clean, enhanced chat interface with light blue gradient and fixed input

import { useState, useRef, useEffect } from 'react';
import { Send, LoaderCircle, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useWeatherStore } from '../state/weatherStore';

function GeminiChatbot() {
  const { aiResponse, isChatLoading, askAi } = useWeatherStore();
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, aiResponse, isChatLoading]);

  const handleSend = () => {
    if (inputValue.trim()) {
      // Add user message to chat history
      const newUserMessage = {
        id: Date.now(),
        type: 'user',
        message: inputValue.trim(),
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, newUserMessage]);
      askAi(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Add AI response to chat history when it's received
  useEffect(() => {
    if (aiResponse && !isChatLoading) {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: aiResponse,
        timestamp: new Date()
      };
      
      setChatHistory(prev => {
        // Check if this AI response is already in history to avoid duplicates
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.type === 'ai' && lastMessage?.message === aiResponse) {
          return prev;
        }
        return [...prev, aiMessage];
      });
    }
  }, [aiResponse, isChatLoading]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">MausamMate</h3>
            <p className="text-blue-100 text-sm">Your AI Weather Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
        style={{ maxHeight: 'calc(100% - 140px)' }}
      >
        {/* Welcome Message */}
        {chatHistory.length === 0 && !isChatLoading && (
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-blue-100 to-sky-100 rounded-lg p-6 inline-block">
              <Bot className="mx-auto mb-2 text-blue-500" size={32} />
              <p className="text-gray-600 font-medium">Hello! I'm MausamMate</p>
              <p className="text-gray-500 text-sm mt-1">Ask me anything about weather!</p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {chatHistory.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                : 'bg-gradient-to-r from-sky-400 to-cyan-400'
            }`}>
              {message.type === 'user' ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`flex-1 max-w-[80%] ${
              message.type === 'user' ? 'text-right' : 'text-left'
            }`}>
              <div className={`inline-block p-3 rounded-2xl shadow-sm ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-md'
                  : 'bg-white border border-blue-100 rounded-bl-md'
              }`}>
                {message.type === 'user' ? (
                  <p className="text-white">{message.message}</p>
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-700 prose-blue">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="ml-4 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="ml-4 mb-2">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-blue-700">{children}</strong>,
                        em: ({ children }) => <em className="italic text-blue-600">{children}</em>,
                        code: ({ children }) => <code className="bg-blue-50 text-blue-800 px-1 py-0.5 rounded text-sm">{children}</code>,
                      }}
                    >
                      {message.message}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Loading Message */}
        {isChatLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-blue-100 rounded-2xl rounded-bl-md p-3 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600">
                <LoaderCircle size={16} className="animate-spin" />
                <span className="text-sm">MausamMate is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-blue-100 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Kal baarish hogi kya?"
              className="w-full p-3 pr-12 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-white/90 backdrop-blur-sm placeholder-gray-400 text-gray-700"
              disabled={isChatLoading}
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSend}
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center min-w-[44px]"
            disabled={isChatLoading || !inputValue.trim()}
          >
            {isChatLoading ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        
        {/* Input Helper */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send • Shift + Enter for new line</span>
          <span>{inputValue.length}/500</span>
        </div>
      </div>
    </div>
  );
}

export default GeminiChatbot;