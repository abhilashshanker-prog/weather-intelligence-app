import React from 'react';
import {
  Compass,
  Eye,
  Gauge,
  Info,
  Sunrise,
  Sunset,
  Sun,
  Thermometer,
  Wind,
  CloudRain,
  Droplet,
} from 'lucide-react';
import { WeatherData, UnitSettings } from '../types/weather';
import {
  formatTemp,
  formatWindSpeed,
  getSunProgress,
  getUVIndexCategory,
  getWindDirectionCardinal,
} from '../utils/weatherUtils';

interface MetricsGridProps {
  data: WeatherData;
  units: UnitSettings;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data, units }) => {
  const { current, daily } = data;
  const today = daily[0] || {};

  const uvCategory = getUVIndexCategory(current.uvIndex);

  const sunInfo = getSunProgress(today.sunrise, today.sunset, current.time);

  const formattedSunrise = today.sunrise
    ? new Date(today.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const formattedSunset = today.sunset
    ? new Date(today.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const windCardinal = getWindDirectionCardinal(current.windDirection);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. UV Index Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" /> UV Index
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${uvCategory.badgeBg}`}>
            {uvCategory.label}
          </span>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{current.uvIndex}</span>
            <span className="text-xs text-slate-400">/ 11+ max</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full mt-2.5 overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-500 to-rose-600 transition-all duration-500"
              style={{ width: `${Math.min(100, (current.uvIndex / 11) * 100)}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
          {uvCategory.advice}
        </p>
      </div>

      {/* 2. Solar Daylight & Sunrise/Sunset Arc */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sunrise className="w-4 h-4 text-amber-400" /> Sun Cycle
          </span>
          <span className="text-[11px] font-mono text-sky-400 font-medium">
            {sunInfo.timeToSunsetOrSunrise}
          </span>
        </div>

        <div className="my-2.5">
          {/* Daylight arc visualizer */}
          <div className="relative w-full h-12 flex items-end justify-center overflow-hidden pt-2">
            <div className="w-full h-20 border-2 border-dashed border-slate-700 rounded-t-full relative flex items-center justify-center">
              <div
                className="absolute bottom-0 w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50 transform -translate-x-1/2 transition-all duration-700"
                style={{
                  left: `${sunInfo.progress}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mt-1">
            <div className="flex items-center gap-1">
              <Sunrise className="w-3.5 h-3.5 text-amber-400" />
              <span>{formattedSunrise}</span>
            </div>
            <div className="flex items-center gap-1">
              <Sunset className="w-3.5 h-3.5 text-orange-400" />
              <span>{formattedSunset}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Daylight progress: <strong className="text-slate-200">{sunInfo.progress}%</strong>
        </p>
      </div>

      {/* 3. Wind Dynamics */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-teal-400" /> Wind & Gusts
          </span>
          <span className="text-xs font-bold text-teal-300 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
            {windCardinal} ({current.windDirection}°)
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {formatWindSpeed(current.windSpeed, units.speed)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 mt-2 pt-2 border-t border-slate-800">
            <span className="text-slate-400">Peak Wind Gusts:</span>
            <span className="font-bold text-teal-300">
              {formatWindSpeed(current.windGusts, units.speed)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Dominant compass heading: <strong className="text-slate-200">{windCardinal}</strong>
        </p>
      </div>

      {/* 4. Atmospheric Metrics (Pressure, Dew Point, Visibility) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-indigo-400" /> Atmospheric
          </span>
          <span className="text-[11px] font-medium text-slate-400">Barometer</span>
        </div>

        <div className="space-y-2.5 my-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" /> Air Pressure
            </span>
            <span className="font-bold text-white">{current.pressureMsl} hPa</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-sky-400" /> Dew Point
            </span>
            <span className="font-bold text-white">
              {formatTemp(current.dewPoint, units.temperature)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-emerald-400" /> Visibility
            </span>
            <span className="font-bold text-white">{current.visibilityKm} km</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          Humidity level: <strong className="text-slate-200">{current.humidity}%</strong>
        </div>
      </div>
    </div>
  );
};
