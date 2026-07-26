import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Clock, CloudRain, Thermometer, Wind, Sparkles } from 'lucide-react';
import { HourlyItem, UnitSettings } from '../types/weather';
import { formatTemp, formatWindSpeed } from '../utils/weatherUtils';

interface HourlyForecastChartProps {
  hourly: HourlyItem[];
  units: UnitSettings;
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ hourly, units }) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'precip' | 'wind'>('temp');

  // Format dataset for recharts
  const chartData = hourly.map((item) => {
    const displayTemp =
      units.temperature === 'F' ? Math.round((item.temperature * 9) / 5 + 32) : item.temperature;
    const displayFeels =
      units.temperature === 'F' ? Math.round((item.feelsLike * 9) / 5 + 32) : item.feelsLike;
    const displayWind =
      units.speed === 'mph' ? Math.round(item.windSpeed * 0.621371) : Math.round(item.windSpeed);

    return {
      time: item.formattedTime,
      temp: displayTemp,
      feelsLike: displayFeels,
      precipProb: item.precipitationProb,
      precipMm: item.precipitation,
      windSpeed: displayWind,
      conditionLabel: item.condition.label,
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">24-Hour Forecast Trend</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hourly meteorological telemetry provided by Open-Meteo API.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('temp')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'temp'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>

          <button
            onClick={() => setActiveTab('precip')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'precip'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'wind'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Speed</span>
          </button>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-64 sm:h-72 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                unit={`°${units.temperature}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: string) => [
                  `${val}°${units.temperature}`,
                  name === 'temp' ? 'Temperature' : 'Feels Like',
                ]}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
                name="temp"
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#feelsGradient)"
                name="feelsLike"
              />
            </AreaChart>
          ) : activeTab === 'precip' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val}%`, 'Rain Probability']}
              />
              <Bar dataKey="precipProb" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={` ${units.speed}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} ${units.speed}`, 'Wind Speed']}
              />
              <Area
                type="monotone"
                dataKey="windSpeed"
                stroke="#2dd4bf"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#windGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
