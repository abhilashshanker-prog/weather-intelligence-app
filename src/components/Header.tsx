import React from 'react';
import {
  CloudSun,
  Compass,
  Github,
  Globe,
  HelpCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { UnitSettings } from '../types/weather';

interface HeaderProps {
  units: UnitSettings;
  onToggleTempUnit: () => void;
  onToggleSpeedUnit: () => void;
  onRefresh: () => void;
  onLocateMe: () => void;
  onOpenDeploymentGuide: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  units,
  onToggleTempUnit,
  onToggleSpeedUnit,
  onRefresh,
  onLocateMe,
  onOpenDeploymentGuide,
  isLoading,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 text-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* App Title & Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
              <CloudSun className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-sky-100 to-indigo-200 bg-clip-text text-transparent">
                  Weather Intelligence
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300">
                  <Sparkles className="w-3 h-3 text-sky-400" /> Open-Meteo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cloudflare Deployment Ready • Live Meteorological Intelligence
              </p>
            </div>
          </div>

          {/* Quick actions for mobile */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenDeploymentGuide}
              className="p-2 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 text-xs font-medium hover:bg-slate-700"
              title="Cloudflare Deployment Instructions"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 disabled:opacity-50"
              title="Refresh Weather Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Controls & Unit Switches */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
          {/* Geolocation Button */}
          <button
            onClick={onLocateMe}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-sky-300 transition-colors disabled:opacity-50"
            title="Use current GPS location"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Near Me</span>
          </button>

          {/* Unit Switcher Group */}
          <div className="flex items-center bg-slate-800/90 rounded-lg border border-slate-700/80 p-0.5">
            <button
              onClick={onToggleTempUnit}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all text-slate-200 hover:text-white"
              title="Toggle Celsius or Fahrenheit"
            >
              <span className={units.temperature === 'C' ? 'text-sky-400 font-bold' : 'text-slate-400'}>
                °C
              </span>
              <span className="mx-1 text-slate-600">/</span>
              <span className={units.temperature === 'F' ? 'text-sky-400 font-bold' : 'text-slate-400'}>
                °F
              </span>
            </button>
            <span className="w-[1px] h-4 bg-slate-700 mx-0.5" />
            <button
              onClick={onToggleSpeedUnit}
              className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all text-slate-200 hover:text-white"
              title="Toggle Wind Speed Units"
            >
              <span className={units.speed === 'kmh' ? 'text-indigo-400 font-bold' : 'text-slate-400'}>
                km/h
              </span>
              <span className="mx-1 text-slate-600">/</span>
              <span className={units.speed === 'mph' ? 'text-indigo-400 font-bold' : 'text-slate-400'}>
                mph
              </span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 transition-colors disabled:opacity-50"
            title="Refresh weather metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Deployment Help Modal Button */}
          <button
            onClick={onOpenDeploymentGuide}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-amber-300 transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Cloudflare Deploy Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
