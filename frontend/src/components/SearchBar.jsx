// ========================================================================
// File: frontend/src/components/SearchBar.jsx (UPGRADED VERSION)
// Purpose: Search bar with dropdown + better theme + auto-close
// ========================================================================
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { fetchDataForLocation } = useWeatherStore();

  // ✅ search API call
  const handleSearch = async () => {
    if (inputValue.trim()) {
      await fetchDataForLocation(inputValue);
      setInputValue('');
      setSuggestions([]); // ✅ dropdown close after search
    }
  };

  // ✅ handle Enter key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // ✅ Select from dropdown
  const handleSelect = (loc) => {
    fetchDataForLocation(loc.name);
    setInputValue(''); 
    setSuggestions([]); // ✅ dropdown close immediately
  };

  // ✅ Dummy suggestions until API integrated
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // 🔹 Replace with API suggestions later
    if (value.length > 1) {
      setSuggestions([
        { name: `${value} City`, lat: 0, lon: 0 },
        { name: `${value} Town`, lat: 1, lon: 1 },
      ]);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Bar */}
      <div className="flex items-center w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="🔍 Search for a city..."
          className="flex-grow px-4 py-3 rounded-l-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button 
          onClick={handleSearch}
          className="p-3 bg-yellow-400 text-gray-900 font-bold rounded-r-xl hover:bg-yellow-500 transition-colors"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white mt-2 rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((loc, index) => (
            <li 
              key={index} 
              onClick={() => handleSelect(loc)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              {loc.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
