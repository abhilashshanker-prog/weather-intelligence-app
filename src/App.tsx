import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CitySearch } from './components/CitySearch';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { MetricsGrid } from './components/MetricsGrid';
import { SmartRecommendations } from './components/SmartRecommendations';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { SevenDayForecast } from './components/SevenDayForecast';
import { CloudflareDeploymentModal } from './components/CloudflareDeploymentModal';

import { GeocodingResult, UnitSettings, WeatherData } from './types/weather';
import { fetchWeatherData, getLocationFromCoords, PRESET_CITIES } from './services/weatherApi';
import { CloudSun, RefreshCw, Sparkles, MapPin, AlertCircle, HelpCircle } from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const [units, setUnits] = useState<UnitSettings>(() => {
    try {
      const saved = localStorage.getItem('weather_unit_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback default
    }
    return { temperature: 'C', speed: 'kmh', precipitation: 'mm' };
  });

  // Save unit settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weather_unit_settings', JSON.stringify(units));
    } catch {
      // Ignore storage errors
    }
  }, [units]);

  // Load weather for a given city location
  const loadWeatherForLocation = useCallback(async (location: GeocodingResult) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Error loading weather:', err);
      setErrorMessage(
        err.message || `Failed to fetch weather data for ${location.name}. Please check internet connection.`
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load: Default to London or last selected location
  useEffect(() => {
    const defaultCity = PRESET_CITIES[0]; // London
    loadWeatherForLocation(defaultCity);
  }, [loadWeatherForLocation]);

  // Handle Geolocation "Near Me"
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = await getLocationFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          await loadWeatherForLocation(location);
        } catch (err: any) {
          setErrorMessage('Unable to retrieve location weather. Please search for a city manually.');
          setIsLoading(false);
        }
      },
      (geoError) => {
        console.warn('Geolocation denied or failed:', geoError);
        setErrorMessage(
          'Location access permission was denied or unavailable. Please search for a city by name.'
        );
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Toggle unit settings
  const toggleTempUnit = () => {
    setUnits((prev) => ({
      ...prev,
      temperature: prev.temperature === 'C' ? 'F' : 'C',
    }));
  };

  const toggleSpeedUnit = () => {
    setUnits((prev) => ({
      ...prev,
      speed: prev.speed === 'kmh' ? 'mph' : 'kmh',
    }));
  };

  // Refresh active weather
  const handleRefresh = () => {
    if (weatherData?.location) {
      loadWeatherForLocation(weatherData.location);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white pb-16">
      {/* Navigation Header */}
      <Header
        units={units}
        onToggleTempUnit={toggleTempUnit}
        onToggleSpeedUnit={toggleSpeedUnit}
        onRefresh={handleRefresh}
        onLocateMe={handleLocateMe}
        onOpenDeploymentGuide={() => setIsGuideOpen(true)}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* City Search & Preset Buttons */}
        <section aria-label="City Search">
          <CitySearch
            onSelectCity={loadWeatherForLocation}
            isLoading={isLoading}
            activeCityName={weatherData?.location.name}
            errorMessage={errorMessage}
          />
        </section>

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div className="space-y-6 animate-pulse">
            <div className="h-72 bg-slate-900/80 rounded-3xl border border-slate-800 p-8 flex flex-col justify-between">
              <div className="h-8 w-48 bg-slate-800 rounded-lg" />
              <div className="h-20 w-64 bg-slate-800 rounded-2xl" />
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div className="h-10 bg-slate-800 rounded-xl" />
                <div className="h-10 bg-slate-800 rounded-xl" />
                <div className="h-10 bg-slate-800 rounded-xl" />
                <div className="h-10 bg-slate-800 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="h-36 bg-slate-900/80 rounded-2xl border border-slate-800" />
              <div className="h-36 bg-slate-900/80 rounded-2xl border border-slate-800" />
              <div className="h-36 bg-slate-900/80 rounded-2xl border border-slate-800" />
              <div className="h-36 bg-slate-900/80 rounded-2xl border border-slate-800" />
            </div>
          </div>
        )}

        {/* Loaded Weather Dashboard */}
        {weatherData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Hero Current Weather Card */}
            <section aria-label="Current Weather">
              <CurrentWeatherCard data={weatherData} units={units} />
            </section>

            {/* Key Atmospheric Metrics Grid */}
            <section aria-label="Key Atmospheric Metrics">
              <MetricsGrid data={weatherData} units={units} />
            </section>

            {/* Smart Recommendations & Activity Feasibility */}
            <section aria-label="Smart Weather Intelligence">
              <SmartRecommendations data={weatherData} />
            </section>

            {/* 24-Hour Forecast Charts & 7-Day Forecast Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section aria-label="Hourly Forecast Trend">
                <HourlyForecastChart hourly={weatherData.hourly} units={units} />
              </section>

              <section aria-label="7-Day Outlook">
                <SevenDayForecast daily={weatherData.daily} units={units} />
              </section>
            </div>
          </div>
        )}

        {/* Footer info & Cloudflare guide button */}
        <footer className="pt-8 pb-4 text-center text-xs text-slate-500 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span>Weather Intelligence App • Powered by Open-Meteo Geocoding & Forecast APIs</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-sky-300 transition-colors flex items-center gap-1 font-medium text-amber-400"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Cloudflare Pages Instructions</span>
            </button>
            <span>•</span>
            <span className="font-mono text-slate-600">Built for Cloudflare Pages</span>
          </div>
        </footer>
      </main>

      {/* Cloudflare Deployment Modal */}
      <CloudflareDeploymentModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
