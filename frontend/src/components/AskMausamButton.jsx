// File: frontend/src/components/AskMausamButton.jsx
// Purpose: A dedicated, prominent button to open the AI chatbot.

import { MessageCircle } from 'lucide-react';

function AskMausamButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
    >
      <MessageCircle size={24} />
      <span className="text-lg font-semibold">Ask Mausam</span>
    </button>
  );
}

export default AskMausamButton;
