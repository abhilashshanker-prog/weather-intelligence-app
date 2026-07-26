export type TemperatureUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';
export type PrecipitationUnit = 'mm' | 'inch';

export interface UnitSettings {
  temperature: TemperatureUnit;
  speed: SpeedUnit;
  precipitation: PrecipitationUnit;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

export interface RawCurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface RawHourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface RawDailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface RawForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current?: RawCurrentWeather;
  hourly_units?: Record<string, string>;
  hourly?: RawHourlyWeather;
  daily_units?: Record<string, string>;
  daily?: RawDailyWeather;
}

export interface WeatherCondition {
  code: number;
  label: string;
  description: string;
  iconName: string;
  bgGradient: string;
  isNight: boolean;
  severity: 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'thunderstorm';
}

export interface HourlyItem {
  time: string;
  formattedTime: string;
  hourNumber: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitationProb: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherCondition;
  windSpeed: number;
  uvIndex: number;
  cloudCover: number;
  visibilityKm: number;
  pressure: number;
}

export interface DailyItem {
  date: string;
  dayOfWeek: string;
  formattedDate: string;
  weatherCode: number;
  condition: WeatherCondition;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface WeatherData {
  location: GeocodingResult;
  fetchedAt: string;
  current: {
    time: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    isDay: boolean;
    precipitation: number;
    weatherCode: number;
    condition: WeatherCondition;
    cloudCover: number;
    pressureMsl: number;
    windSpeed: number;
    windDirection: number;
    windGusts: number;
    uvIndex: number;
    visibilityKm: number;
    dewPoint: number;
  };
  hourly: HourlyItem[];
  daily: DailyItem[];
}

export interface ActivityFeasibility {
  name: string;
  category: string;
  icon: string;
  score: number; // 0 to 100
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unfavorable';
  summary: string;
  tips: string;
}

export interface IntelligenceAdvisory {
  id: string;
  title: string;
  category: 'clothing' | 'travel' | 'health' | 'safety' | 'general';
  severity: 'info' | 'warning' | 'alert' | 'success';
  icon: string;
  message: string;
  details?: string;
}
