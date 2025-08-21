// ========================================================================
// File: frontend/src/components/SearchBar.jsx (FIXED VERSION)
// Purpose: Modern search bar with proper LocationIQ integration and dropdown
// ========================================================================
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { 
    fetchDataForLocation, 
    searchResults, 
    selectLocation, 
    clearSearchResults,
    error
  } = useWeatherStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        clearSearchResults();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clearSearchResults]);

  // Handle search as user types (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.trim() && inputValue.length >= 2) {
        fetchDataForLocation(inputValue.trim());
        setShowResults(true);
      } else {
        clearSearchResults();
        setShowResults(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, fetchDataForLocation, clearSearchResults]);

  // Show results when they arrive
  useEffect(() => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  }, [searchResults]);

  // Handle manual search button click
  const handleSearch = () => {
    if (inputValue.trim()) {
      fetchDataForLocation(inputValue.trim());
      setShowResults(true);
    }
  };

  // Handle enter key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
    
    // Handle arrow navigation in dropdown
    if (event.key === 'Escape') {
      setShowResults(false);
      clearSearchResults();
    }
  };

  // Handle location selection
  const handleSelect = (location) => {
    console.log('SearchBar: Location selected:', location);
    
    // Set the input to show selected location
    setInputValue(location.name);
    
    // Close dropdown
    setShowResults(false);
    clearSearchResults();
    
    // Trigger weather fetch
    selectLocation(location);
  };

  // Clear input and results
  const handleClear = () => {
    setInputValue('');
    setShowResults(false);
    clearSearchResults();
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Bar */}
      <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 
                      rounded-2xl border border-blue-200 shadow-sm hover:shadow-md 
                      transition-all duration-300">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="🔍 Search for a city..."
          className="flex-grow px-4 py-3 rounded-l-2xl bg-transparent 
                    focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                    placeholder:text-gray-400 text-gray-700"
          autoComplete="off"
        />
        
        {/* Clear button when there's input */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
        
        <button 
          onClick={handleSearch}
          className="p-3 bg-blue-500 text-white rounded-r-2xl 
                    hover:bg-blue-600 active:scale-95 transition-transform"
          title="Search"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border border-blue-200 
                        rounded-xl shadow-lg max-h-60 overflow-y-auto z-50
                        animate-fade-in">
          {searchResults.map((location, index) => (
            <div
              key={index}
              onClick={() => handleSelect(location)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer 
                        transition-colors border-b border-gray-100 last:border-b-0
                        flex flex-col"
            >
              <div className="font-medium text-gray-800 text-sm">
                {location.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {location.admin1 && `${location.admin1}, `}
                {location.country}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && inputValue.trim() && searchResults.length === 0 && !error && (
        <div className="absolute mt-2 w-full bg-white border border-blue-200 
                        rounded-xl shadow-lg p-4 z-50 text-center text-gray-500 text-sm">
          No locations found for "{inputValue}"
        </div>
      )}

      {/* Error Message */}
      {showResults && error && (
        <div className="absolute mt-2 w-full bg-white border border-red-200 
                        rounded-xl shadow-lg p-4 z-50 text-center text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default SearchBar;