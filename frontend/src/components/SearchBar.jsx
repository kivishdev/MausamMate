// ========================================================================
// File: frontend/src/components/SearchBar.jsx (Material 3 Expressive Design)
// Purpose: Modern search bar with Material 3 styling, LocationIQ integration, and enhanced UX
// ========================================================================
import { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Loader2, Navigation, Globe, AlertCircle } from 'lucide-react';
import { useWeatherStore } from '../state/weatherStore';

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
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
        setIsFocused(false);
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
      inputRef.current?.blur();
    }
  };

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    if (inputValue.trim() && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    // Delay blur to allow for dropdown clicks
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  // Handle location selection
  const handleSelect = (selectedLocation) => {
    console.log('SearchBar: Location selected:', selectedLocation);
    
    // Set the input to show selected location
    setInputValue(selectedLocation.name);
    
    // Close dropdown
    setShowResults(false);
    clearSearchResults();
    setIsFocused(false);
    
    // Trigger weather fetch
    selectLocation(selectedLocation);
  };

  // Clear input and results
  const handleClear = () => {
    setInputValue('');
    setShowResults(false);
    clearSearchResults();
    inputRef.current?.focus();
  };

  // Request location permission
  const handleLocationRequest = () => {
    requestLocationPermission();
  };

  // Get location status styling
  const getLocationButtonStyling = () => {
    if (locationPermissionState === 'pending') {
      return {
        container: "bg-tertiary-container border-outline-variant",
        icon: "text-tertiary animate-spin"
      };
    }
    if (locationPermissionState === 'denied') {
      return {
        container: "bg-error-container hover:bg-error border-outline-variant hover:shadow-elevation-1",
        icon: "text-error hover:text-on-error"
      };
    }
    return {
      container: "bg-primary-container hover:bg-primary border-outline-variant hover:shadow-elevation-1",
      icon: "text-primary hover:text-on-primary"
    };
  };

  const locationButtonStyle = getLocationButtonStyling();

  return (
    <div className="relative w-full max-w-lg" ref={searchRef}>
      {/* Enhanced Search Bar Container */}
      <div className={`flex items-center bg-surface-container-high rounded-[28px] border transition-all duration-300 shadow-elevation-1 ${
        isFocused 
          ? 'border-primary shadow-elevation-3 ring-1 ring-primary/20' 
          : 'border-outline-variant hover:shadow-elevation-2'
      }`}>
        
        {/* Enhanced Location Button */}
        {!location && locationPermissionState !== 'pending' && (
          <button
            onClick={handleLocationRequest}
            className={`p-4 transition-all duration-200 rounded-l-[28px] active:scale-95 ${locationButtonStyle.container}`}
            title="Use my current location"
          >
            <Navigation size={20} className={locationButtonStyle.icon} />
          </button>
        )}
        
        {/* Enhanced Loading Indicator for Location Permission */}
        {locationPermissionState === 'pending' && (
          <div className="p-4 bg-tertiary-container rounded-l-[28px] border-r border-outline-variant">
            <Loader2 size={20} className="text-tertiary animate-spin" />
          </div>
        )}

        {/* Enhanced Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={location ? "Search for another city..." : "Search for a city..."}
          className={`flex-grow px-6 py-4 bg-transparent text-on-surface placeholder:text-on-surface-variant
                    focus:outline-none font-medium text-base transition-all duration-200 ${
                      !location && locationPermissionState !== 'pending' 
                        ? 'rounded-none' 
                        : 'rounded-l-[28px]'
                    }`}
          autoComplete="off"
        />
        
        {/* Enhanced Clear Button */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="p-2 mx-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest 
                      rounded-[12px] transition-all duration-200 active:scale-90"
            title="Clear search"
          >
            <X size={18} />
          </button>
        )}
        
        {/* Enhanced Search Button */}
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className={`p-4 rounded-r-[28px] transition-all duration-200 active:scale-95 shadow-elevation-1 ${
            isSearching 
              ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' 
              : 'bg-primary text-on-primary hover:bg-primary/90 hover:shadow-elevation-2'
          }`}
          title="Search"
        >
          {isSearching ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Search size={22} />
          )}
        </button>
      </div>

      {/* Enhanced Current Location Indicator */}
      {location && (
        <div className="flex items-center justify-center mt-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container rounded-[16px] 
                         border border-outline-variant shadow-elevation-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <MapPin size={14} className="text-primary" />
            <span className="text-sm font-medium text-on-primary-container">
              Current: {location.name}
            </span>
          </div>
        </div>
      )}

      {/* Enhanced Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute mt-3 w-full bg-surface-container-high border border-outline-variant 
                        rounded-[20px] shadow-elevation-4 max-h-72 overflow-y-auto z-50
                        animate-fade-in backdrop-blur-sm">
          <div className="p-2">
            <div className="flex items-center gap-2 px-4 py-2 mb-2">
              <Globe size={16} className="text-primary" />
              <span className="text-sm font-bold text-on-surface tracking-wide">SEARCH RESULTS</span>
            </div>
            {searchResults.map((searchLocation, index) => (
              <div
                key={index}
                onClick={() => handleSelect(searchLocation)}
                className="px-4 py-4 hover:bg-surface-container-highest cursor-pointer 
                          transition-all duration-200 rounded-[16px] mb-1 last:mb-0
                          flex items-center justify-between group active:scale-[0.98]
                          hover:shadow-elevation-1 border border-transparent hover:border-outline-variant"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tertiary-container rounded-[8px] group-hover:bg-tertiary 
                                 transition-colors duration-200">
                    <MapPin size={16} className="text-tertiary group-hover:text-on-tertiary" />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold text-on-surface text-base tracking-tight">
                      {searchLocation.name}
                    </div>
                    <div className="text-sm text-on-surface-variant font-medium">
                      {searchLocation.admin1 && `${searchLocation.admin1}, `}
                      {searchLocation.country}
                    </div>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="p-1 bg-primary rounded-[6px]">
                    <Search size={12} className="text-on-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Loading State in Dropdown */}
      {showResults && isSearching && (
        <div className="absolute mt-3 w-full bg-surface-container-high border border-outline-variant 
                        rounded-[20px] shadow-elevation-4 p-6 z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary-container rounded-full">
              <Loader2 size={24} className="text-primary animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-on-surface mb-1">Searching locations...</p>
              <p className="text-sm text-on-surface-variant">Finding the best matches</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced No Results Message */}
      {showResults && inputValue.trim() && searchResults.length === 0 && !error && !isSearching && (
        <div className="absolute mt-3 w-full bg-surface-container-high border border-outline-variant 
                        rounded-[20px] shadow-elevation-4 p-6 z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-surface-variant rounded-full">
              <Search size={24} className="text-on-surface-variant" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-on-surface mb-1">
                No locations found
              </p>
              <p className="text-sm text-on-surface-variant mb-2">
                No results for "{inputValue}"
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container 
                             rounded-[12px] border border-outline-variant">
                <span className="text-xs font-medium text-on-secondary-container">
                  Try a different search term
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Message */}
      {showResults && error && (
        <div className="absolute mt-3 w-full bg-surface-container-high border border-outline-variant 
                        rounded-[20px] shadow-elevation-4 p-6 z-50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-error-container rounded-full">
              <AlertCircle size={24} className="text-error" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-error mb-1">
                Search Error
              </p>
              <p className="text-sm text-on-error-container bg-error-container px-3 py-2 
                           rounded-[12px] border border-outline-variant">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Tips (shown when focused but no input) */}
      {isFocused && !inputValue.trim() && !location && (
        <div className="absolute mt-3 w-full bg-surface-container-high border border-outline-variant 
                        rounded-[20px] shadow-elevation-4 p-6 z-50 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-secondary-container rounded-[8px]">
                <Search size={16} className="text-secondary" />
              </div>
              <span className="text-sm font-bold text-on-surface tracking-wide">SEARCH TIPS</span>
            </div>
            <div className="space-y-3 text-sm text-on-surface-variant">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Try searching for cities like "Mumbai", "Delhi", or "Bangalore"</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Include state/country for better results: "Paris, France"</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-tertiary rounded-full"></div>
                <span>Use the location button for automatic detection</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;