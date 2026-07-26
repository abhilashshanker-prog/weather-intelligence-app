import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bike,
  CheckCircle2,
  ChevronRight,
  Info,
  ShieldAlert,
  Shirt,
  Smile,
  Sparkles,
  Sun,
  Umbrella,
  Utensils,
  Waves,
  Wind,
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { generateWeatherIntelligence } from '../utils/weatherUtils';

interface SmartRecommendationsProps {
  data: WeatherData;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ data }) => {
  const { activities, advisories } = generateWeatherIntelligence(data);
  const [activeTab, setActiveTab] = useState<'activities' | 'advisories'>('activities');

  const renderAdvisoryIcon = (icon: string) => {
    switch (icon) {
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-indigo-400" />;
      case 'Umbrella':
        return <Umbrella className="w-5 h-5 text-sky-400" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-400" />;
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  const renderActivityIcon = (icon: string) => {
    switch (icon) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Bike':
        return <Bike className="w-5 h-5 text-sky-400" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'Waves':
        return <Waves className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'from-sky-500 to-indigo-500 text-sky-400 border-sky-500/30';
    if (score >= 40) return 'from-amber-500 to-orange-500 text-amber-400 border-amber-500/30';
    return 'from-rose-500 to-red-600 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Weather Intelligence & Planning
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated meteorological assessment for apparel, travel safety, and outdoor planning.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'activities'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Activity Feasibility
          </button>
          <button
            onClick={() => setActiveTab('advisories')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'advisories'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Smart Advisories</span>
            {advisories.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {advisories.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Activity Feasibility */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {activities.map((act) => (
            <div
              key={act.name}
              className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4.5 hover:border-slate-600 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 group-hover:bg-slate-700 transition-colors">
                      {renderActivityIcon(act.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {act.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                        {act.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border bg-slate-900 ${
                      act.score >= 70
                        ? 'text-emerald-400 border-emerald-500/30'
                        : act.score >= 50
                        ? 'text-amber-400 border-amber-500/30'
                        : 'text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {act.status}
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-4 mb-2">
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-400">Suitability Index</span>
                    <span className="font-bold text-white font-mono">{act.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(
                        act.score
                      )} transition-all duration-700`}
                      style={{ width: `${act.score}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{act.summary}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-700/50 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{act.tips}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Smart Advisories */}
      {activeTab === 'advisories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {advisories.map((adv) => (
            <div
              key={adv.id}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                adv.severity === 'alert'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  : adv.severity === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : adv.severity === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  adv.severity === 'alert'
                    ? 'bg-rose-500/20 text-rose-300'
                    : adv.severity === 'warning'
                    ? 'bg-amber-500/20 text-amber-300'
                    : adv.severity === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-700 text-sky-300'
                }`}
              >
                {renderAdvisoryIcon(adv.icon)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{adv.title}</h4>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20">
                    {adv.category}
                  </span>
                </div>
                <p className="text-xs font-semibold">{adv.message}</p>
                {adv.details && (
                  <p className="text-xs text-slate-300/90 leading-relaxed">{adv.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
