import {
  ActivityFeasibility,
  DailyItem,
  HourlyItem,
  IntelligenceAdvisory,
  SpeedUnit,
  TemperatureUnit,
  WeatherCondition,
  WeatherData,
} from '../types/weather';

/**
 * Maps WMO (World Meteorological Organization) weather codes to human-readable details
 */
export function getWMOCondition(code: number, isDay: boolean = true): WeatherCondition {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Sunny with clear, blue skies' : 'Clear starry night sky',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradient: isDay
          ? 'from-sky-400 via-blue-500 to-amber-200'
          : 'from-slate-900 via-indigo-950 to-slate-900',
        isNight: !isDay,
        severity: 'clear',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: 'Mostly sunny with occasional thin clouds',
        iconName: isDay ? 'SunDim' : 'MoonStar',
        bgGradient: isDay
          ? 'from-sky-400 via-sky-500 to-indigo-300'
          : 'from-slate-900 via-slate-800 to-indigo-950',
        isNight: !isDay,
        severity: 'clear',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered cloud cover with pleasant breaks of sun',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        bgGradient: isDay
          ? 'from-blue-400 via-sky-500 to-slate-300'
          : 'from-slate-900 via-slate-800 to-blue-950',
        isNight: !isDay,
        severity: 'cloudy',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Dense cloud cover blocking direct sunlight',
        iconName: 'Cloud',
        bgGradient: 'from-slate-500 via-slate-600 to-gray-700',
        isNight: !isDay,
        severity: 'cloudy',
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 45 ? 'Foggy' : 'Depositing Rime Fog',
        description: 'Reduced visibility due to low-lying fog and moisture',
        iconName: 'CloudFog',
        bgGradient: 'from-slate-400 via-gray-500 to-slate-600',
        isNight: !isDay,
        severity: 'fog',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        description: 'Fine light misting rain continuously falling',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-sky-600 via-slate-700 to-blue-800',
        isNight: !isDay,
        severity: 'rain',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Light drizzle freezing on cold surfaces',
        iconName: 'CloudSnow',
        bgGradient: 'from-cyan-700 via-slate-800 to-blue-900',
        isNight: !isDay,
        severity: 'rain',
      };
    case 61:
    case 63:
    case 65:
      return {
        code,
        label: code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        description: code === 65 ? 'Torrential rainfall expected' : 'Continuous rainfall',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-700 via-slate-800 to-indigo-900',
        isNight: !isDay,
        severity: 'rain',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Icy precipitation creating slick road conditions',
        iconName: 'CloudHail',
        bgGradient: 'from-teal-800 via-slate-900 to-cyan-900',
        isNight: !isDay,
        severity: 'rain',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        code,
        label: code === 71 ? 'Slight Snow' : code === 73 ? 'Moderate Snowfall' : 'Heavy Snowfall',
        description: 'Snow flakes accumulating on surfaces',
        iconName: 'Snowflake',
        bgGradient: 'from-slate-400 via-blue-300 to-slate-600',
        isNight: !isDay,
        severity: 'snow',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: 'Rain Showers',
        description: 'Intermittent heavy rain showers with brief clear breaks',
        iconName: 'CloudRainWind',
        bgGradient: 'from-blue-600 via-indigo-800 to-slate-900',
        isNight: !isDay,
        severity: 'rain',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Intermittent flurries of snow and icy wind',
        iconName: 'CloudSnow',
        bgGradient: 'from-indigo-700 via-slate-800 to-blue-950',
        isNight: !isDay,
        severity: 'snow',
      };
    case 95:
    case 96:
    case 99:
      return {
        code,
        label: code === 95 ? 'Thunderstorm' : 'Thunderstorm with Hail',
        description: 'Severe electric storm with lightning and heavy precipitation',
        iconName: 'CloudLightning',
        bgGradient: 'from-amber-900 via-slate-950 to-indigo-950',
        isNight: !isDay,
        severity: 'thunderstorm',
      };
    default:
      return {
        code,
        label: 'Variable Weather',
        description: 'Mixed atmospheric conditions',
        iconName: 'Cloud',
        bgGradient: 'from-slate-600 via-slate-700 to-slate-800',
        isNight: !isDay,
        severity: 'cloudy',
      };
  }
}

/**
 * Converts Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Formats temperature based on unit setting
 */
export function formatTemp(tempC: number, unit: TemperatureUnit = 'C'): string {
  if (tempC === undefined || tempC === null || isNaN(tempC)) return '--°';
  const value = unit === 'F' ? celsiusToFahrenheit(tempC) : Math.round(tempC);
  return `${value}°${unit}`;
}

/**
 * Formats wind speed based on unit setting
 */
export function formatWindSpeed(speedKmh: number, unit: SpeedUnit = 'kmh'): string {
  if (speedKmh === undefined || speedKmh === null || isNaN(speedKmh)) return '--';
  if (unit === 'mph') {
    const mph = Math.round(speedKmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Converts wind direction in degrees to cardinal compass heading
 */
export function getWindDirectionCardinal(degrees: number): string {
  if (degrees === undefined || degrees === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5);
  return directions[index % 16];
}

/**
 * Formats UV Index level and returns risk info
 */
export function getUVIndexCategory(uv: number): {
  label: string;
  color: string;
  badgeBg: string;
  advice: string;
} {
  if (uv <= 2) {
    return {
      label: 'Low',
      color: 'text-emerald-500',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      advice: 'No protection required. Safe to stay outside.',
    };
  }
  if (uv <= 5) {
    return {
      label: 'Moderate',
      color: 'text-amber-500',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      advice: 'Wear sunglasses and apply SPF 30+ if staying outside for prolonged periods.',
    };
  }
  if (uv <= 7) {
    return {
      label: 'High',
      color: 'text-orange-500',
      badgeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
      advice: 'Seek shade during midday hours. Wear a hat, UV-blocking sunglasses, and sunscreen.',
    };
  }
  if (uv <= 10) {
    return {
      label: 'Very High',
      color: 'text-rose-500',
      badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
      advice: 'Avoid sun exposure between 10 AM and 4 PM. Reapply sunscreen every 2 hours.',
    };
  }
  return {
    label: 'Extreme',
    color: 'text-purple-600',
    badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
    advice: 'Take all precautions. Unprotected skin can burn in minutes.',
  };
}

/**
 * Calculates daylight progress percentage between sunrise and sunset
 */
export function getSunProgress(sunriseIso: string, sunsetIso: string, currentIso?: string): {
  progress: number; // 0 to 100
  isDaytime: boolean;
  timeToSunsetOrSunrise: string;
} {
  try {
    const sunrise = new Date(sunriseIso).getTime();
    const sunset = new Date(sunsetIso).getTime();
    const now = currentIso ? new Date(currentIso).getTime() : new Date().getTime();

    if (isNaN(sunrise) || isNaN(sunset)) {
      return { progress: 50, isDaytime: true, timeToSunsetOrSunrise: 'N/A' };
    }

    const totalDaylight = sunset - sunrise;
    if (now < sunrise) {
      const diffMin = Math.round((sunrise - now) / 60000);
      const hrs = Math.floor(diffMin / 60);
      const mins = diffMin % 60;
      return {
        progress: 0,
        isDaytime: false,
        timeToSunsetOrSunrise: hrs > 0 ? `Sunrise in ${hrs}h ${mins}m` : `Sunrise in ${mins}m`,
      };
    }

    if (now > sunset) {
      return {
        progress: 100,
        isDaytime: false,
        timeToSunsetOrSunrise: 'Sun has set',
      };
    }

    const elapsed = now - sunrise;
    const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDaylight) * 100)));
    const diffMin = Math.round((sunset - now) / 60000);
    const hrs = Math.floor(diffMin / 60);
    const mins = diffMin % 60;

    return {
      progress,
      isDaytime: true,
      timeToSunsetOrSunrise: hrs > 0 ? `Sunset in ${hrs}h ${mins}m` : `Sunset in ${mins}m`,
    };
  } catch {
    return { progress: 50, isDaytime: true, timeToSunsetOrSunrise: 'N/A' };
  }
}

/**
 * Smart Intelligence Engine: Generates activity feasibility scores and actionable advisories
 */
export function generateWeatherIntelligence(data: WeatherData): {
  activities: ActivityFeasibility[];
  advisories: IntelligenceAdvisory[];
} {
  const current = data.current;
  const today: Partial<DailyItem> = data.daily[0] || {};
  const temp = current.temperature;
  const rainProb = today.precipitationProbabilityMax ?? 0;
  const wind = current.windSpeed;
  const uv = current.uvIndex;
  const humidity = current.humidity;
  const isDay = current.isDay;

  const advisories: IntelligenceAdvisory[] = [];

  // Clothing Advisory
  if (temp < 5) {
    advisories.push({
      id: 'adv-clothing-cold',
      title: 'Heavy Winter Apparel',
      category: 'clothing',
      severity: 'warning',
      icon: 'Shirt',
      message: 'Sub-freezing or chilly air.',
      details: 'Wear an insulated heavy coat, thermal layers, scarf, and thermal gloves.',
    });
  } else if (temp < 15) {
    advisories.push({
      id: 'adv-clothing-cool',
      title: 'Layered Warm Wear',
      category: 'clothing',
      severity: 'info',
      icon: 'Shirt',
      message: 'Cool atmospheric conditions.',
      details: 'A medium jacket, fleece sweater, or windbreaker is highly recommended.',
    });
  } else if (temp > 30) {
    advisories.push({
      id: 'adv-clothing-hot',
      title: 'Breathable & Light Clothing',
      category: 'clothing',
      severity: 'warning',
      icon: 'Sun',
      message: 'High heat index.',
      details: 'Opt for loose-fitting, light-colored cotton or moisture-wicking fabrics.',
    });
  } else {
    advisories.push({
      id: 'adv-clothing-ideal',
      title: 'Comfortable Everyday Wear',
      category: 'clothing',
      severity: 'success',
      icon: 'Smile',
      message: 'Optimal thermal comfort.',
      details: 'T-shirt or light long sleeves will feel very pleasant.',
    });
  }

  // Travel / Rain Gear Advisory
  if (rainProb >= 60 || current.precipitation > 0.5) {
    advisories.push({
      id: 'adv-rain-alert',
      title: 'Rain Protection Required',
      category: 'travel',
      severity: 'alert',
      icon: 'Umbrella',
      message: `High precipitation likelihood (${rainProb}%).`,
      details: 'Carry a sturdy umbrella and wear water-resistant footwear for outdoor travel.',
    });
  } else if (rainProb >= 30) {
    advisories.push({
      id: 'adv-rain-chance',
      title: 'Slight Rain Risk',
      category: 'travel',
      severity: 'info',
      icon: 'CloudDrizzle',
      message: `Passing shower chance (${rainProb}%).`,
      details: 'Keep a portable rain jacket or umbrella handy in your backpack.',
    });
  }

  // Wind Advisory
  if (wind >= 45) {
    advisories.push({
      id: 'adv-wind-alert',
      title: 'Gale-Force Wind Warning',
      category: 'safety',
      severity: 'alert',
      icon: 'Wind',
      message: `High wind speeds up to ${Math.round(wind)} km/h.`,
      details: 'Secure loose outdoor objects. Driving tall vehicles or cycling may be perilous.',
    });
  }

  // UV Health Advisory
  if (uv >= 6) {
    const uvInfo = getUVIndexCategory(uv);
    advisories.push({
      id: 'adv-uv-alert',
      title: `High Solar UV Index (${uv})`,
      category: 'health',
      severity: 'warning',
      icon: 'Sun',
      message: uvInfo.advice,
      details: 'Apply broad-spectrum SPF 30+ sunscreen every 2 hours and wear UV-rated eyewear.',
    });
  }

  // Activity Feasibility Calculations
  // 1. Outdoor Running
  let runScore = 100;
  if (temp < 0 || temp > 32) runScore -= 35;
  else if (temp < 10 || temp > 26) runScore -= 15;
  if (rainProb > 50) runScore -= 40;
  else if (rainProb > 25) runScore -= 20;
  if (wind > 35) runScore -= 25;
  if (humidity > 85 && temp > 25) runScore -= 20;
  runScore = Math.max(10, Math.min(100, runScore));

  // 2. Cycling / Biking
  let cycleScore = 100;
  if (wind > 30) cycleScore -= 40;
  else if (wind > 20) cycleScore -= 20;
  if (rainProb > 40) cycleScore -= 45;
  if (temp < 5 || temp > 33) cycleScore -= 30;
  cycleScore = Math.max(10, Math.min(100, cycleScore));

  // 3. Outdoor Dining / Patio
  let diningScore = 100;
  if (temp < 16 || temp > 30) diningScore -= 35;
  if (rainProb > 30) diningScore -= 50;
  if (wind > 25) diningScore -= 30;
  if (!isDay) diningScore -= 10;
  diningScore = Math.max(10, Math.min(100, diningScore));

  // 4. Stargazing / Night Sky
  let starScore = 100;
  if (isDay) starScore = 20; // Only at night
  if (current.cloudCover > 70) starScore -= 60;
  else if (current.cloudCover > 30) starScore -= 30;
  if (rainProb > 30) starScore -= 40;
  starScore = Math.max(10, Math.min(100, starScore));

  // 5. Beach & Swimming / Pool
  let beachScore = 100;
  if (!isDay) beachScore = 15;
  if (temp < 24) beachScore -= (24 - temp) * 8;
  if (current.cloudCover > 60) beachScore -= 25;
  if (rainProb > 30) beachScore -= 40;
  if (wind > 35) beachScore -= 20;
  beachScore = Math.max(10, Math.min(100, Math.round(beachScore)));

  const getStatusText = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 30) return 'Poor';
    return 'Unfavorable';
  };

  const activities: ActivityFeasibility[] = [
    {
      name: 'Outdoor Running',
      category: 'Fitness',
      icon: 'Activity',
      score: runScore,
      status: getStatusText(runScore),
      summary: runScore >= 70 ? 'Crisp and favorable conditions for jogging or outdoor workouts.' : 'Consider indoor gym or short runs due to weather factors.',
      tips: `Temp: ${Math.round(temp)}°C, Rain Chance: ${rainProb}%, Wind: ${Math.round(wind)} km/h`,
    },
    {
      name: 'Cycling & Biking',
      category: 'Fitness',
      icon: 'Bike',
      score: cycleScore,
      status: getStatusText(cycleScore),
      summary: cycleScore >= 70 ? 'Low wind resistance and dry road surfaces.' : 'High wind or damp roads require cautious braking.',
      tips: `Wind speed: ${Math.round(wind)} km/h, Surface moisture risk: ${rainProb}%`,
    },
    {
      name: 'Outdoor Patio & Dining',
      category: 'Leisure',
      icon: 'Utensils',
      score: diningScore,
      status: getStatusText(diningScore),
      summary: diningScore >= 70 ? 'Comfortable temperature and clear skies for outdoor seating.' : 'Better to choose indoor or covered seating options.',
      tips: `Thermal comfort: ${Math.round(temp)}°C, Breeze: ${Math.round(wind)} km/h`,
    },
    {
      name: 'Beach & Watersports',
      category: 'Recreation',
      icon: 'Waves',
      score: beachScore,
      status: getStatusText(beachScore),
      summary: beachScore >= 70 ? 'Warm solar heating and high sun exposure.' : 'Sub-optimal temperature or low solar clearance.',
      tips: `Sun & Temp: ${Math.round(temp)}°C, Cloud cover: ${current.cloudCover}%`,
    },
    {
      name: 'Stargazing / Astronomy',
      category: 'Night Sky',
      icon: 'Sparkles',
      score: starScore,
      status: getStatusText(starScore),
      summary: starScore >= 70 ? 'Clear night skies with excellent celestial visibility.' : 'Cloud density limits telescope and constellation visibility.',
      tips: `Cloud Cover: ${current.cloudCover}%, Visibility: ${current.visibilityKm} km`,
    },
  ];

  return { activities, advisories };
}
