"use client";

import { useEffect, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { mapToWeatherCondition } from "@/lib/mapCondition";
import WeatherBackground from "@/components/WeatherBackground";
import CompareLocation from "@/components/CompareLocation";
import Conditons from "@/components/Condition";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import WeatherHeading from "@/components/WeatherHeading";
import { useUnits } from "@/context/provider/UnitsProvider";
import { WeatherCondition, WeatherData } from "@/types/componentTypes";
import Favorite from "@/components/Favorite";

export default function Home() {
  const { coords } = useLocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [bgCondition, setBgCondition] = useState<WeatherCondition>(null);
  const {isCurrentlyImperial } = useUnits();

  useEffect(() => {
    if (!coords) return;

    setLoading(true);
    const unit = isCurrentlyImperial ? "metric" : "imperial"
    fetch(`/api/weather-heading?lat=${coords.lat}&lon=${coords.lon}&units=${unit}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setWeatherData({
            city:          data.city,
            country:       data.country,
            condition:     data.condition,
            description:   data.description,
            temp:          data.temp,
            feelsLike:     data.feelsLike,
            humidity:      data.humidity,
            windSpeed:     data.windSpeed,
            visibility:    data.visibility,
            pressure:      data.pressure,
            dewPoint:      data.dewPoint,
            precipitation: data.precipitation ?? 0,
            icon:          data.icon,
            advisory:      data.advisory,
            hourlyForecastByDay: data.hourlyForecastByDay,
            dailyForecast: data.dailyForecast,
          });

          // Map real condition + icon code to background animation
          // Extract icon code from the full URL e.g. "01n" from ".../01n@2x.png"
          const iconCode = data.icon?.match(/\/(\w+)@/)?.[1] ?? "";
          setBgCondition(mapToWeatherCondition(data.condition, iconCode));
        }
      })
      .catch(() => {
        setWeatherData(null);
        setBgCondition(null);
      })
      .finally(() => setLoading(false));
  }, [coords, isCurrentlyImperial]);

  return (
    <>
      {/* Full-page weather background — driven by real condition */}
      <WeatherBackground condition={bgCondition} />

      <div className="relative z-50 flex flex-col items-center w-full px-4 md:px-8 mt-10 text-foreground">

        <WeatherHeading />
        <SearchBar />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-6xl my-6">

          <Favorite />

          {/* Main */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <WeatherCard loading={loading} weatherData={weatherData} conditions={bgCondition} />
            <Conditons loading={loading} weatherData={weatherData}  />
            <DailyForecast loading={loading} weatherData={weatherData} />
          </div>

          {/* Hourly */}
          <div className="lg:col-span-3 h-full">
            <HourlyForecast loading={loading} weatherData={weatherData} />
          </div>
        </div>

        <hr className="w-full border-border/60 my-4" />

        <CompareLocation loading={loading} weatherData={weatherData}/>
      </div>
    </>
  );
}