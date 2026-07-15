export interface OpenWeather25Response {
  /** Geographic coordinates of the location */
  coord: {
    /** Longitude of the location */
    lon: number;
    /** Latitude of the location */
    lat: number;
  };
  
  /** Weather condition codes and descriptions (array containing core state) */
  weather: {
    /** Weather condition id */
    id: number;
    /** Group of weather parameters (Rain, Snow, Clouds etc.) */
    main: string;
    /** Weather condition description within the group */
    description: string;
    /** Weather icon id */
    icon: string;
  }[];
  
  /** Internal OpenWeather parameter */
  base: string;
  
  /** Main atmospheric metrics */
  main: {
    /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit */
    temp: number;
    /** Temperature accounting for human perception of weather */
    feels_like: number;
    /** Minimum temperature at the moment of observation (regional variation bound) */
    temp_min: number;
    /** Maximum temperature at the moment of observation (regional variation bound) */
    temp_max: number;
    /** Atmospheric pressure on the sea level, hPa */
    pressure: number;
    /** Humidity, % */
    humidity: number;
    /** Atmospheric pressure on the sea level, hPa (Optional) */
    sea_level?: number;
    /** Atmospheric pressure on the ground level, hPa (Optional) */
    grnd_level?: number;
  };
  
  /** Visibility in meters. The maximum value of the visibility is 10km */
  visibility: number;
  
  /** Wind details */
  wind: {
    /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
    speed: number;
    /** Wind direction, degrees (meteorological) */
    deg: number;
    /** Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour (Optional) */
    gust?: number;
  };
  
  /** Cloudiness configuration */
  clouds: {
    /** Cloudiness, % */
    all: number;
  };
  
  /** Precipitation volume (Only present if rain is actively falling) */
  rain?: {
    /** Rain volume for the last 1 hour, mm */
    "1h"?: number;
    /** Rain volume for the last 3 hours, mm */
    "3h"?: number;
  };
  
  /** Precipitation volume (Only present if snow is actively falling) */
  snow?: {
    /** Snow volume for the last 1 hour, mm */
    "1h"?: number;
    /** Snow volume for the last 3 hours, mm */
    "3h"?: number;
  };
  
  /** Time of data calculation, unix, UTC */
  dt: number;
  
  /** Geographical and systemic country blocks */
  sys: {
    /** Internal parameter */
    type?: number;
    /** Internal parameter */
    id?: number;
    /** Country code (GB, JP, NG etc.) */
    country: string;
    /** Sunrise time, unix, UTC */
    sunrise: number;
    /** Sunset time, unix, UTC */
    sunset: number;
  };
  
  /** Shift in seconds from UTC */
  timezone: number;
  
  /** City ID */
  id: number;
  
  /** City name */
  name: string;
  
  /** Internal parameter */
  cod: number;
}


export interface OpenWeatherResponse {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number };
  visibility: number;
}

export interface OpenWeatherGeocodeItem {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface FormattedCityData {
  name: string;
  lat: number;
  lon: number;
  countryCode: string;
  state: string;
}

export interface OpenWeatherForecastResponse {
  list: {
    dt: number;
    main: { temp: number };
    weather: { main: string; description: string; icon: string }[];
  }[];
}
export interface HourlyForecast { 
  time: string; 
  temp: number; 
  condition: string; 
  icon: string;
}
export interface DailyForecast {
  day: string;
  date: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  icon: string;
}