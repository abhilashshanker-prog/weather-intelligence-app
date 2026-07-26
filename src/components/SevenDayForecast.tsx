import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  Cloud,
} from 'lucide-react';
import { DailyItem, UnitSettings } from '../types/weather';
import { formatTemp, formatWindSpeed } from '../utils/weatherUtils';

interface SevenDayForecastProps {
  daily: DailyItem[];
  units: UnitSettings;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({ daily, units }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Compute global max and min across 7 days for relative progress bar scaling
  const allMaxs = daily.map((d) => d.tempMax);
  const allMins = daily.map((d) => d.tempMin);
  const minTempGlobal = Math.min(...allMins);
  const maxTempGlobal = Math.max(...allMaxs);
  const tempRangeGlobal = Math.max(1, maxTempGlobal - minTempGlobal);

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">7-Day Meteorological Outlook</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Open-Meteo Forecast</span>
      </div>

      {/* Daily Cards List */}
      <div className="divide-y divide-slate-800/80 mt-2">
        {daily.map((day) => {
          const isExpanded = expandedDate === day.date;

          // Calculate percentage width for visual temperature range bar
          const leftPercent = Math.max(
            0,
            Math.min(100, ((day.tempMin - minTempGlobal) / tempRangeGlobal) * 100)
          );
          const barWidthPercent = Math.max(
            10,
            Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / tempRangeGlobal) * 100)
          );

          const sunriseFormatted = day.sunrise
            ? new Date(day.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A';
          const sunsetFormatted = day.sunset
            ? new Date(day.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A';

          return (
            <div key={day.date} className="py-3.5 transition-colors group">
              <div
                onClick={() => toggleExpand(day.date)}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 p-2 rounded-2xl transition-all"
              >
                {/* Day & Condition */}
                <div className="flex items-center gap-3 min-w-[180px]">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 text-sky-400 group-hover:bg-slate-700 transition-colors">
                    <Sun className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {day.dayOfWeek}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{day.formattedDate}</span>
                    </div>
                    <span className="text-xs text-slate-300 font-medium block">
                      {day.condition.label}
                    </span>
                  </div>
                </div>

                {/* Rain Probability Pill */}
                <div className="flex items-center gap-2 shrink-0">
                  {day.precipitationProbabilityMax > 15 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300">
                      <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                      <span>{day.precipitationProbabilityMax}%</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 px-2.5 py-1">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>0%</span>
                    </span>
                  )}
                </div>

                {/* Temperature Range Bar */}
                <div className="flex items-center gap-3 w-full sm:w-64">
                  <span className="text-xs font-semibold text-slate-400 w-10 text-right font-mono">
                    {formatTemp(day.tempMin, units.temperature)}
                  </span>

                  <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden border border-slate-700/50">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400 transition-all duration-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-white w-10 font-mono">
                    {formatTemp(day.tempMax, units.temperature)}
                  </span>
                </div>

                {/* Expand Chevron */}
                <button className="text-slate-400 group-hover:text-white p-1 rounded-lg">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expandable Daily Details Drawer */}
              {isExpanded && (
                <div className="mt-3 p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-[10px] uppercase text-slate-400">Sunrise</div>
                      <div className="font-bold text-white">{sunriseFormatted}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="text-[10px] uppercase text-slate-400">Sunset</div>
                      <div className="font-bold text-white">{sunsetFormatted}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-300" />
                    <div>
                      <div className="text-[10px] uppercase text-slate-400">Max UV Index</div>
                      <div className="font-bold text-white">{day.uvIndexMax}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="text-[10px] uppercase text-slate-400">Max Wind Gusts</div>
                      <div className="font-bold text-white">
                        {formatWindSpeed(day.windGustsMax, units.speed)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
