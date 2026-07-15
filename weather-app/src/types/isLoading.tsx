import { WeatherData } from "./componentTypes";

export default interface isLoadingProps {
  loading: boolean;
  weatherData: WeatherData| null;
}
