import { WeatherData } from "@/components/WeatherCard";

export default interface isLoadingProps {
  loading: boolean;
  weatherData: WeatherData | null;
}
