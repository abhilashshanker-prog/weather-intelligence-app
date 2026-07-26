import React from 'react';
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSun,
  MapPin,
  Moon,
  Snowflake,
  Sun,
  Wind,
  Droplets,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { WeatherData, UnitSettings } from '../types/weather';
import { formatTemp, formatWindSpeed } from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  data: WeatherData;
  units: UnitSettings;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, units }) => {
  const { location, current, daily, fetchedAt } = data;
  const condition = current.condition;
  const today = daily[0] || { tempMax: current.temperature, tempMin: current.temperature };

  // Dynamic Lucide icon selection based on condition iconName
  const renderWeatherIcon = (iconName: string) => {
    const iconClass = 'w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-md';
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${iconClass} text-amber-300 animate-spin-slow`} />;
      case 'Moon':
        return <Moon className={`${iconClass} text-indigo-200`} />;
      case 'CloudSun':
        return <CloudSun className={`${iconClass} text-amber-200`} />;
      case 'CloudMoon':
        return <CloudMoon className={`${iconClass} text-indigo-200`} />;
      case 'CloudRain':
      case 'CloudDrizzle':
        return <CloudRain className={`${iconClass} text-sky-200 animate-bounce-subtle`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${iconClass} text-yellow-300`} />;
      case 'Snowflake':
      case 'CloudSnow':
        return <Snowflake className={`${iconClass} text-cyan-100`} />;
      case 'CloudFog':
        return <CloudFog className={`${iconClass} text-slate-200`} />;
      default:
        return <Cloud className={`${iconClass} text-slate-200`} />;
    }
  };

  const formattedFetchedTime = new Date(fetchedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${condition.bgGradient} p-6 sm:p-8 text-white shadow-2xl border border-white/10 transition-all duration-500`}
    >
      {/* Subtle Atmospheric Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] pointer-events-none" />

      {/* Background Decorative Rings */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[260px] gap-6">
        {/* Top Bar: Location & Status */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5 text-sky-300 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                {location.name}
              </h2>
              {location.country_code && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-white/20 backdrop-blur-md uppercase tracking-wider">
                  {location.country_code}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-white/80 mt-1 pl-7 font-medium">
              {[location.admin1, location.country].filter(Boolean).join(', ')} •{' '}
              <span className="font-mono text-white/70">{location.timezone}</span>
            </p>
          </div>

          {/* Condition Badge & Updated Time */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{condition.label}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-white/70">
              <Clock className="w-3 h-3" />
              <span>Updated {formattedFetchedTime}</span>
            </div>
          </div>
        </div>

        {/* Center Section: Temperature & Icon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 my-2">
          <div className="flex items-baseline gap-4">
            <span className="text-6xl sm:text-8xl font-black tracking-tighter drop-shadow-lg font-sans">
              {formatTemp(current.temperature, units.temperature)}
            </span>
            <div className="flex flex-col justify-center text-sm sm:text-base text-white/90">
              <span className="font-medium text-white/80">
                Feels like{' '}
                <strong className="text-white font-bold">
                  {formatTemp(current.feelsLike, units.temperature)}
                </strong>
              </span>
              <div className="flex items-center gap-3 mt-1 font-semibold text-xs sm:text-sm">
                <span className="flex items-center text-emerald-300">
                  <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                  High: {formatTemp(today.tempMax, units.temperature)}
                </span>
                <span className="flex items-center text-sky-200">
                  <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                  Low: {formatTemp(today.tempMin, units.temperature)}
                </span>
              </div>
            </div>
          </div>

          <div className="self-center sm:self-auto flex flex-col items-center">
            {renderWeatherIcon(condition.iconName)}
            <p className="text-xs text-white/80 mt-1 max-w-[200px] text-center font-medium">
              {condition.description}
            </p>
          </div>
        </div>

        {/* Bottom Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
          <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <Droplets className="w-4 h-4 text-sky-300 shrink-0" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                Humidity
              </div>
              <div className="text-sm font-bold">{current.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <Wind className="w-4 h-4 text-teal-300 shrink-0" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                Wind Speed
              </div>
              <div className="text-sm font-bold">
                {formatWindSpeed(current.windSpeed, units.speed)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <Sun className="w-4 h-4 text-amber-300 shrink-0" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                UV Index
              </div>
              <div className="text-sm font-bold">{current.uvIndex}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-indigo-200 shrink-0" />
            <div>
              <div className="text-[10px] text-white/70 uppercase tracking-wider font-medium">
                Cloud Cover
              </div>
              <div className="text-sm font-bold">{current.cloudCover}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
