
import { ReactNode } from "react";
import { DailyForecast, HourlyForecast } from "./weather";

export interface WeatherData {
  city: string;
  country: string;
  condition: string;
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  visibility: number;
  pressure: number;
  dewPoint: number;
  icon: string;
  advisory: string;
  hourlyForecastByDay: Record<string, HourlyForecast[]>;
  dailyForecast: DailyForecast[];
}
export interface FavoriteDataProps {
  id: string;
  city?: string;
  country?: string | null;
  lat: number;
  lon: number;
}

export interface FavoriteProps {
  favData: FavoriteDataProps[];
}

export interface WeatherCardProps {
  loading: boolean;
  weatherData: WeatherData | null;
  conditions: WeatherCondition | null;
  favData: FavoriteDataProps[];
  onToggle: (d: FavoriteDataProps) => void;
  coords: { lat: number; lon: number } | null;
}
export type WeatherCondition =
  | "sunny"
  | "rainy"
  | "cloudy"
  | "stormy"
  | "snowy"
  | "foggy"
  | "night"
  | null;

export interface WeatherBackgroundProps {
  condition: WeatherCondition;
  children?: ReactNode;
}

export interface CityData {
  name: string;
  countryCode: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface SearchBarProps {
  onCitySelect?: (city: CityData) => void;
}

export interface AnimatedNumberProps {
  value: number;
  duration?: number; // duration in milliseconds
}