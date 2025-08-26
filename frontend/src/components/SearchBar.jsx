// ========================================================================
// File: frontend/src/components/SearchBar.jsx (ENHANCED WITH LOCATION FEATURES)
// Purpose: Modern search bar with proper LocationIQ integration, dropdown, and location retry
// ========================================================================
import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const { 
    fetchDataForLocation, 
    searchResults, 
    selectLocation, 
    clearSearchResults,
    error,
    requestLocationPermission,
    locationPermissionState,
    location
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
        setIsSearching(true);
        fetchDataForLocation(inputValue.trim()).finally(() => {
          setIsSearching(false);
        });
        setShowResults(true);
      } else {
        clearSearchResults();
        setShowResults(false);
        setIsSearching(false);
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
      setIsSearching(true);
      fetchDataForLocation(inputValue.trim()).finally(() => {
        setIsSearching(false);
      });
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

  // Request location permission
  const handleLocationRequest = () => {
    requestLocationPermission();
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Bar */}
      <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 
                      rounded-2xl border border-blue-200 shadow-sm hover:shadow-md 
                      transition-all duration-300">
        
        {/* Location button (show when no location detected) */}
        {!location && locationPermissionState !== 'pending' && (
          <button
            onClick={handleLocationRequest}
            className="p-3 text-blue-500 hover:text-blue-600 transition-colors 
                      hover:bg-blue-100 rounded-l-2xl"
            title="Use my current location"
          >
            <MapPin size={18} />
          </button>
        )}
        
        {/* Loading indicator for location permission */}
        {locationPermissionState === 'pending' && (
          <div className="p-3 text-blue-500">
            <Loader2 size={18} className="animate-spin" />
          </div>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={location ? `Search for another city...` : `🔍 Search for a city...`}
          className={`flex-grow px-4 py-3 bg-transparent 
                    focus:outline-none focus:ring-2 focus:ring-blue-400/50 
                    placeholder:text-gray-400 text-gray-700 ${
                      !location && locationPermissionState !== 'pending' ? 'rounded-none' : 'rounded-l-2xl'
                    }`}
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
        
        {/* Search button with loading state */}
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="p-3 bg-blue-500 text-white rounded-r-2xl 
                    hover:bg-blue-600 active:scale-95 transition-transform
                    disabled:bg-blue-300 disabled:cursor-not-allowed"
          title="Search"
        >
          {isSearching ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Search size={20} />
          )}
        </button>
      </div>

      {/* Current location indicator */}
      {location && (
        <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={10} className="text-green-500" />
          <span>Current: {location.name}</span>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border border-blue-200 
                        rounded-xl shadow-lg max-h-60 overflow-y-auto z-50
                        animate-fade-in">
          {searchResults.map((searchLocation, index) => (
            <div
              key={index}
              onClick={() => handleSelect(searchLocation)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer 
                        transition-colors border-b border-gray-100 last:border-b-0
                        flex items-center justify-between group"
            >
              <div className="flex flex-col">
                <div className="font-medium text-gray-800 text-sm">
                  {searchLocation.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {searchLocation.admin1 && `${searchLocation.admin1}, `}
                  {searchLocation.country}
                </div>
              </div>
              <MapPin size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* Loading state in dropdown */}
      {showResults && isSearching && (
        <div className="absolute mt-2 w-full bg-white border border-blue-200 
                        rounded-xl shadow-lg p-4 z-50 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-500">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Searching locations...</span>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && inputValue.trim() && searchResults.length === 0 && !error && !isSearching && (
        <div className="absolute mt-2 w-full bg-white border border-blue-200 
                        rounded-xl shadow-lg p-4 z-50 text-center text-gray-500 text-sm">
          <div className="flex flex-col items-center gap-2">
            <Search size={20} className="text-gray-400" />
            <span>No locations found for "{inputValue}"</span>
            <div className="text-xs text-gray-400">Try a different search term</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {showResults && error && (
        <div className="absolute mt-2 w-full bg-white border border-red-200 
                        rounded-xl shadow-lg p-4 z-50 text-center text-red-500 text-sm">
          <div className="flex flex-col items-center gap-2">
            <X size={20} className="text-red-400" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;