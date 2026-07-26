import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Clock, AlertCircle, Sparkles, Building2 } from 'lucide-react';
import { GeocodingResult } from '../types/weather';
import { searchCities, PRESET_CITIES } from '../services/weatherApi';

interface CitySearchProps {
  onSelectCity: (city: GeocodingResult) => void;
  isLoading: boolean;
  activeCityName?: string;
  errorMessage?: string | null;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectCity,
  isLoading,
  activeCityName,
  errorMessage,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        if (results.length === 0) {
          setSearchError(`No cities found matching "${trimmed}". Check spelling or try a major city name.`);
        }
      } catch (err: any) {
        setSearchError(err.message || 'Geocoding service unavailable.');
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);

    // Update recent searches
    const updated = [city, ...recentSearches.filter((c) => c.id !== city.id)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSearchError(null);
  };

  return (
    <div className="w-full relative z-30" ref={dropdownRef}>
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search city name (e.g. London, Tokyo, Chicago, Paris)..."
            className="w-full pl-12 pr-12 py-3.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-900 text-white placeholder-slate-400 rounded-2xl border border-slate-700/80 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-lg text-sm md:text-base transition-all"
            disabled={isLoading}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (query.trim().length >= 2 || recentSearches.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search Spinner */}
            {isSearching && (
              <div className="p-4 flex items-center gap-3 text-slate-400 text-sm">
                <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span>Searching Open-Meteo Geocoding API...</span>
              </div>
            )}

            {/* Error Message in Search */}
            {searchError && !isSearching && (
              <div className="p-4 bg-rose-500/10 border-l-4 border-rose-500 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-200">City Not Found</p>
                  <p>{searchError}</p>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!isSearching && suggestions.length > 0 && (
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                <div className="px-4 py-2 text-[11px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-800/40">
                  Open-Meteo Locations ({suggestions.length})
                </div>
                {suggestions.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}-${city.longitude}`}
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-sky-500/20 text-slate-400 group-hover:text-sky-300 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 text-sm group-hover:text-sky-300 transition-colors">
                          {city.name}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {city.admin1 && <span>{city.admin1},</span>}
                          <span>{city.country || city.country_code}</span>
                          <span className="text-slate-600">•</span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="text-xs font-semibold text-slate-400 px-2 py-1 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Recent City Searches
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {recentSearches.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelect(city)}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700/60 flex items-center gap-1.5 transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-sky-400" />
                      <span>{city.name}</span>
                      {city.country_code && (
                        <span className="text-[10px] text-slate-400 uppercase font-mono">
                          {city.country_code}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Error Banner if search or API failed */}
      {errorMessage && (
        <div className="mt-3 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-md animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-rose-100">Weather Intelligence Alert</h4>
            <p className="mt-0.5 text-rose-200/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Popular Preset City Quick Chips */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-slate-400 shrink-0 flex items-center gap-1 pl-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Popular:
        </span>
        <div className="flex items-center gap-1.5">
          {PRESET_CITIES.map((city) => {
            const isActive = activeCityName?.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.id}
                onClick={() => onSelectCity(city)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'bg-sky-500 text-white border-sky-400 shadow-sm shadow-sky-500/30 font-semibold'
                    : 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <Building2 className="w-3 h-3 opacity-70" />
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
