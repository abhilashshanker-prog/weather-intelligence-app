import {
  GeocodingResponse,
  GeocodingResult,
  HourlyItem,
  DailyItem,
  RawForecastResponse,
  WeatherData,
} from '../types/weather';
import { getWMOCondition } from '../utils/weatherUtils';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export const PRESET_CITIES: GeocodingResult[] = [
  {
    id: 2643743,
    name: 'London',
    latitude: 51.50853,
    longitude: -0.12574,
    country: 'United Kingdom',
    country_code: 'GB',
    timezone: 'Europe/London',
  },
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.71427,
    longitude: -74.00597,
    admin1: 'New York',
    country: 'United States',
    country_code: 'US',
    timezone: 'America/New_York',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.69171,
    country: 'Japan',
    country_code: 'JP',
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.85341,
    longitude: 2.3488,
    country: 'France',
    country_code: 'FR',
    timezone: 'Europe/Paris',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.86785,
    longitude: 151.20732,
    country: 'Australia',
    country_code: 'AU',
    timezone: 'Australia/Sydney',
  },
  {
    id: 1275339,
    name: 'Mumbai',
    latitude: 19.07283,
    longitude: 72.88261,
    admin1: 'Maharashtra',
    country: 'India',
    country_code: 'IN',
    timezone: 'Asia/Kolkata',
  },
];

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding search failed with status ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching geocoding results:', error);
    throw new Error(`Unable to find locations matching "${trimmed}". Please verify spelling.`);
  }
}

/**
 * Reverse geocodes lat/lon to nearest city name using Open-Meteo or BigDataCloud
 */
export async function getLocationFromCoords(latitude: number, longitude: number): Promise<GeocodingResult> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (response.ok) {
      const data = await response.json();
      return {
        id: Math.floor(Math.random() * 1000000),
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        latitude,
        longitude,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding failed, falling back to default timezone:', e);
  }

  return {
    id: 999999,
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
    country_code: '',
    timezone: 'auto',
  };
}

/**
 * Fetches comprehensive weather data from Open-Meteo Forecast API
 */
export async function fetchWeatherData(location: GeocodingResult): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    timezone: location.timezone || 'auto',
  });

  const url = `${FORECAST_API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API returned HTTP status ${response.status}`);
    }

    const rawData: RawForecastResponse = await response.json();

    if (!rawData.current || !rawData.hourly || !rawData.daily) {
      throw new Error('Incomplete weather payload received from Open-Meteo API.');
    }

    // Process Current Weather
    const isDay = rawData.current.is_day === 1;
    const currentCode = rawData.current.weather_code;
    const currentCondition = getWMOCondition(currentCode, isDay);

    // Current UV Index & Dew point approximation from nearest hourly index
    const currentHourIndex = new Date().getHours();
    const currentUvIndex = rawData.hourly.uv_index?.[currentHourIndex] ?? rawData.daily.uv_index_max[0] ?? 0;
    const currentDewPoint = rawData.hourly.dew_point_2m?.[currentHourIndex] ?? (rawData.current.temperature_2m - (100 - rawData.current.relative_humidity_2m) / 5);
    const currentVisibility = (rawData.hourly.visibility?.[currentHourIndex] ?? 10000) / 1000; // in km

    // Process Hourly Forecast (Next 24 Hours)
    const hourlyList: HourlyItem[] = [];
    const nowHour = new Date();
    nowHour.setMinutes(0, 0, 0);

    const totalHours = Math.min(24, rawData.hourly.time.length);
    for (let i = 0; i < totalHours; i++) {
      const timeStr = rawData.hourly.time[i];
      const hourDate = new Date(timeStr);
      const hourNum = hourDate.getHours();
      const hourIsDay = hourNum >= 6 && hourNum < 20;

      hourlyList.push({
        time: timeStr,
        formattedTime: hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hourNumber: hourNum,
        temperature: Math.round(rawData.hourly.temperature_2m[i] * 10) / 10,
        feelsLike: Math.round(rawData.hourly.apparent_temperature[i] * 10) / 10,
        humidity: rawData.hourly.relative_humidity_2m[i],
        precipitationProb: rawData.hourly.precipitation_probability[i] || 0,
        precipitation: rawData.hourly.precipitation[i] || 0,
        weatherCode: rawData.hourly.weather_code[i],
        condition: getWMOCondition(rawData.hourly.weather_code[i], hourIsDay),
        windSpeed: rawData.hourly.wind_speed_10m[i],
        uvIndex: rawData.hourly.uv_index[i] || 0,
        cloudCover: rawData.hourly.cloud_cover[i] || 0,
        visibilityKm: Math.round((rawData.hourly.visibility[i] || 10000) / 1000),
        pressure: Math.round(rawData.hourly.surface_pressure[i] || 1013),
      });
    }

    // Process Daily Forecast (7 Days)
    const dailyList: DailyItem[] = [];
    const daysCount = Math.min(7, rawData.daily.time.length);

    for (let i = 0; i < daysCount; i++) {
      const dateStr = rawData.daily.time[i];
      const dateObj = new Date(dateStr + 'T00:00:00');
      const isToday = i === 0;

      const dayOfWeek = isToday
        ? 'Today'
        : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      dailyList.push({
        date: dateStr,
        dayOfWeek,
        formattedDate,
        weatherCode: rawData.daily.weather_code[i],
        condition: getWMOCondition(rawData.daily.weather_code[i], true),
        tempMax: Math.round(rawData.daily.temperature_2m_max[i]),
        tempMin: Math.round(rawData.daily.temperature_2m_min[i]),
        apparentTempMax: Math.round(rawData.daily.apparent_temperature_max[i]),
        apparentTempMin: Math.round(rawData.daily.apparent_temperature_min[i]),
        sunrise: rawData.daily.sunrise[i],
        sunset: rawData.daily.sunset[i],
        uvIndexMax: rawData.daily.uv_index_max[i] || 0,
        precipitationSum: Math.round((rawData.daily.precipitation_sum[i] || 0) * 10) / 10,
        precipitationProbabilityMax: rawData.daily.precipitation_probability_max[i] || 0,
        windSpeedMax: Math.round(rawData.daily.wind_speed_10m_max[i] || 0),
        windGustsMax: Math.round(rawData.daily.wind_gusts_10m_max[i] || 0),
        windDirectionDominant: rawData.daily.wind_direction_10m_dominant[i] || 0,
      });
    }

    return {
      location,
      fetchedAt: new Date().toISOString(),
      current: {
        time: rawData.current.time,
        temperature: Math.round(rawData.current.temperature_2m * 10) / 10,
        feelsLike: Math.round(rawData.current.apparent_temperature * 10) / 10,
        humidity: rawData.current.relative_humidity_2m,
        isDay,
        precipitation: rawData.current.precipitation,
        weatherCode: currentCode,
        condition: currentCondition,
        cloudCover: rawData.current.cloud_cover,
        pressureMsl: Math.round(rawData.current.pressure_msl || rawData.current.surface_pressure),
        windSpeed: Math.round(rawData.current.wind_speed_10m * 10) / 10,
        windDirection: rawData.current.wind_direction_10m,
        windGusts: Math.round(rawData.current.wind_gusts_10m * 10) / 10,
        uvIndex: currentUvIndex,
        visibilityKm: currentVisibility,
        dewPoint: Math.round(currentDewPoint * 10) / 10,
      },
      hourly: hourlyList,
      daily: dailyList,
    };
  } catch (error: any) {
    console.error('Failed to fetch weather data from Open-Meteo:', error);
    throw new Error(error.message || 'Network error fetching weather metrics. Please try again.');
  }
}
