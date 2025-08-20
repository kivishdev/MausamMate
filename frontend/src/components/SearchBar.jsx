// ========================================================================
// File: frontend/src/components/SearchBar.jsx (UPDATED VERSION)
// Purpose: Modern search bar design
// ========================================================================
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const { fetchDataForLocation } = useWeatherStore();

  const handleSearch = () => {
    if (inputValue.trim()) {
      fetchDataForLocation(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search for a city..."
        className="flex-grow px-4 py-3 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
      />
      <button 
        onClick={handleSearch}
        className="p-3 bg-blue-500 text-white rounded-r-xl hover:bg-blue-600 transition-colors"
      >
        <Search size={20} />
      </button>
    </div>
  );
}
export default SearchBar;

