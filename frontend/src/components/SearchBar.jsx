// ========================================================================
// File: frontend/src/components/SearchBar.jsx (FINAL UPDATED VERSION)
// Purpose: Modern search bar with selectable search results + clean dropdown close
// ========================================================================
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const { 
    fetchDataForLocation, 
    searchResults, 
    selectLocation, 
    clearSearchResults // 👈 add from store
  } = useWeatherStore();

  // ✅ handle search on button/enter
  const handleSearch = () => {
    if (inputValue.trim()) {
      fetchDataForLocation(inputValue);
    }
  };

  // ✅ enter key triggers search
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // ✅ select a location from results
  const handleSelect = (loc) => {
    selectLocation(loc); // store me location set + weather fetch
    setInputValue('');
    clearSearchResults(); // 👈 store se hi clear
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Bar */}
      <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 
                      rounded-2xl border border-blue-200 shadow-sm hover:shadow-md 
                      transition-all duration-300">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="🔍 Search for a city..."
          className="flex-grow px-4 py-3 rounded-l-2xl bg-transparent 
                     focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                     placeholder:text-gray-400 text-gray-700"
        />
        <button 
          onClick={handleSearch}
          className="p-3 bg-blue-500 text-white rounded-r-2xl 
                     hover:bg-blue-600 active:scale-95 transition-transform"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border border-blue-200 
                        rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
          {searchResults.map((loc, index) => (
            <div
              key={index}
              onClick={() => handleSelect(loc)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer 
                         transition-colors"
            >
              <span className="font-medium text-gray-700">
                {loc.name}, {loc.country}
              </span>
              {loc.state && (
                <span className="text-gray-500 text-sm ml-1">
                  ({loc.state})
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
