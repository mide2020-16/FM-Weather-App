import { type WeatherCondition } from "@/components/WeatherBackground";

export function mapToWeatherCondition(
  condition: string | null | undefined,
  icon?: string // OpenWeatherMap icon code e.g. "01n" — "n" suffix = night
): WeatherCondition {
  if (!condition) return null;

  // Check for night using icon code (icons ending in "n" are night variants)
  const isNight = icon?.endsWith("n") ?? false;

  const c = condition.toLowerCase();

  if (c === "thunderstorm") return "stormy";
  if (c === "drizzle" || c === "rain") return isNight ? "night" : "rainy";
  if (c === "snow") return "snowy";
  if (c === "mist" || c === "smoke" || c === "haze" || c === "fog" || c === "dust" || c === "sand" || c === "ash" || c === "squall" || c === "tornado") return "foggy";
  if (c === "clear") return isNight ? "night" : "sunny";
  if (c === "clouds") return isNight ? "night" : "cloudy";

  return null;
}
